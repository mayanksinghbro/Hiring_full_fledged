import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAttestation } from "@/lib/blockchain";

/**
 * GET /api/trustoffer/verify/[uid] — Publicly verify an offer's cryptographic proof
 * Anyone can call this to confirm an offer is authentic
 */
export async function GET(request, { params }) {
    try {
        const { uid } = await params;

        const offer = await db.trustOffer.findUnique({
            where: { attestationUID: uid },
        });

        if (!offer) {
            return NextResponse.json(
                { verified: false, error: "Attestation not found" },
                { status: 404 }
            );
        }

        // Cryptographically verify the signature
        const verification = verifyAttestation({
            domain: {
                name: "PlacifyTrustOffer",
                version: "1",
                chainId: 84532,
            },
            types: {
                JobOffer: [
                    { name: "companyName", type: "string" },
                    { name: "candidateName", type: "string" },
                    { name: "roleTitle", type: "string" },
                    { name: "packageLPA", type: "uint256" },
                    { name: "offerTimestamp", type: "uint64" },
                    { name: "status", type: "string" },
                ],
            },
            data: offer.attestationData,
            signature: offer.attestationSig,
            signerAddress: offer.signerAddress,
        });

        return NextResponse.json({
            verified: verification.valid,
            offer: {
                companyName: offer.companyName,
                candidateName: offer.candidateName,
                roleTitle: offer.roleTitle,
                packageLPA: offer.packageLPA,
                status: offer.status,
                createdAt: offer.createdAt,
                acceptedAt: offer.acceptedAt,
                rescindedAt: offer.rescindedAt,
            },
            cryptography: {
                attestationUID: offer.attestationUID,
                signerAddress: offer.signerAddress,
                recoveredAddress: verification.recoveredAddress,
                signatureValid: verification.valid,
                protocol: "EIP-712 Typed Data (PlacifyTrustOffer v1)",
                chainId: 84532,
                chainName: "Base Sepolia",
            },
        });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { verified: false, error: "Verification failed" },
            { status: 500 }
        );
    }
}
