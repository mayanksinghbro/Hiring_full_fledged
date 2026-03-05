import { ethers } from "ethers";

// ─────────────────────────────────────────────────────────────
// TrustOffer — Zero-Cost Cryptographic Attestations
// Uses EIP-712 Typed Data Signing (same crypto as EAS/Sign Protocol)
// ─────────────────────────────────────────────────────────────

// EIP-712 Domain — identifies this as a Placify TrustOffer attestation
const DOMAIN = {
    name: "PlacifyTrustOffer",
    version: "1",
    chainId: 84532, // Base Sepolia chain ID
};

// EIP-712 Type definition — the structure of a verified job offer
const OFFER_TYPES = {
    JobOffer: [
        { name: "companyName", type: "string" },
        { name: "candidateName", type: "string" },
        { name: "roleTitle", type: "string" },
        { name: "packageLPA", type: "uint256" },
        { name: "offerTimestamp", type: "uint64" },
        { name: "status", type: "string" },
    ],
};

/**
 * Returns the server-side signer wallet (no gas needed for signing)
 */
function getSigner() {
    const privateKey = process.env.TRUSTOFFER_SIGNER_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("Missing TRUSTOFFER_SIGNER_PRIVATE_KEY in environment");
    }
    return new ethers.Wallet(privateKey);
}

/**
 * Get the public signer address (for display/verification)
 */
export function getSignerAddress() {
    return getSigner().address;
}

/**
 * Creates a cryptographically signed job offer attestation.
 * This is FREE — no gas or blockchain transaction needed.
 * The signature is mathematically verifiable by anyone.
 *
 * @param {Object} offerData
 * @param {string} offerData.companyName
 * @param {string} offerData.candidateName
 * @param {string} offerData.roleTitle
 * @param {number|string} offerData.packageLPA - Package in LPA (e.g., 12)
 * @param {string} [offerData.status="Pending"]
 * @returns {Promise<Object>} Signed attestation with uid, signature, data
 */
export async function createOfferAttestation(offerData) {
    const signer = getSigner();

    const offerValue = {
        companyName: offerData.companyName,
        candidateName: offerData.candidateName,
        roleTitle: offerData.roleTitle,
        packageLPA: BigInt(Math.round(Number(offerData.packageLPA) * 100)), // Store as integer (12.5 LPA → 1250)
        offerTimestamp: BigInt(Math.floor(Date.now() / 1000)),
        status: offerData.status || "Pending",
    };

    // Sign the typed data (EIP-712) — this is the core cryptographic operation
    const signature = await signer.signTypedData(DOMAIN, OFFER_TYPES, offerValue);

    // Generate a unique attestation ID from the signature hash
    const uid = ethers.keccak256(signature);

    return {
        uid,
        signature,
        signerAddress: signer.address,
        data: {
            ...offerValue,
            packageLPA: offerValue.packageLPA.toString(),
            offerTimestamp: offerValue.offerTimestamp.toString(),
        },
        domain: DOMAIN,
        types: OFFER_TYPES,
        createdAt: new Date().toISOString(),
    };
}

/**
 * Creates a signed status update attestation (Accept / Rescind).
 * References the original offer UID.
 */
export async function createStatusAttestation(originalUID, newStatus) {
    const signer = getSigner();

    const statusValue = {
        companyName: "",        // Will be filled from original offer in API layer
        candidateName: "",      // Will be filled from original offer in API layer
        roleTitle: "",          // Will be filled from original offer in API layer
        packageLPA: 0n,
        offerTimestamp: BigInt(Math.floor(Date.now() / 1000)),
        status: newStatus,      // "Accepted" or "Rescinded"
    };

    const signature = await signer.signTypedData(DOMAIN, OFFER_TYPES, statusValue);
    const uid = ethers.keccak256(signature);

    return {
        uid,
        signature,
        signerAddress: signer.address,
        originalOfferUID: originalUID,
        newStatus,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Verifies that an attestation was genuinely signed by the Placify server.
 * Anyone can call this to confirm an offer is authentic.
 *
 * @param {Object} attestation - The attestation object
 * @returns {{ valid: boolean, recoveredAddress: string }}
 */
export function verifyAttestation(attestation) {
    try {
        const recoveredAddress = ethers.verifyTypedData(
            attestation.domain,
            attestation.types,
            attestation.data,
            attestation.signature
        );

        const isValid =
            recoveredAddress.toLowerCase() === attestation.signerAddress.toLowerCase();

        return {
            valid: isValid,
            recoveredAddress,
            signerAddress: attestation.signerAddress,
        };
    } catch (error) {
        return {
            valid: false,
            error: error.message,
        };
    }
}

/**
 * Calculates a company's reputation score based on their offer history.
 * Score = 100 - (rescinded / total * 50)
 *
 * @param {{ total: number, accepted: number, rescinded: number }} stats
 * @returns {{ score: number, grade: string, color: string }}
 */
export function calculateReputation(stats) {
    if (stats.total === 0) {
        return { score: 100, grade: "New", color: "gray" };
    }

    const rescindPenalty = (stats.rescinded / stats.total) * 50;
    const score = Math.max(0, Math.round(100 - rescindPenalty));

    let grade, color;
    if (score >= 95) {
        grade = "Excellent";
        color = "green";
    } else if (score >= 80) {
        grade = "Good";
        color = "yellow";
    } else {
        grade = "Poor";
        color = "red";
    }

    return { score, grade, color };
}
