import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createOfferAttestation } from "@/lib/blockchain";

/**
 * POST /api/trustoffer — Create a new blockchain-verified job offer
 * Body: { companyName, candidateName, roleTitle, packageLPA }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { companyName, candidateName, roleTitle, packageLPA } = body;

        if (!companyName || !candidateName || !roleTitle || !packageLPA) {
            return NextResponse.json(
                { error: "Missing required fields: companyName, candidateName, roleTitle, packageLPA" },
                { status: 400 }
            );
        }

        // 1. Create cryptographic attestation (free, no gas)
        const attestation = await createOfferAttestation({
            companyName,
            candidateName,
            roleTitle,
            packageLPA,
        });

        // 2. Store in database
        const offer = await db.trustOffer.create({
            data: {
                companyName,
                candidateName,
                roleTitle,
                packageLPA: parseFloat(packageLPA),
                status: "Pending",
                attestationUID: attestation.uid,
                attestationSig: attestation.signature,
                attestationData: attestation.data,
                signerAddress: attestation.signerAddress,
            },
        });

        return NextResponse.json({
            success: true,
            offer: {
                id: offer.id,
                companyName: offer.companyName,
                candidateName: offer.candidateName,
                roleTitle: offer.roleTitle,
                packageLPA: offer.packageLPA,
                status: offer.status,
                attestationUID: offer.attestationUID,
                signerAddress: offer.signerAddress,
                createdAt: offer.createdAt,
            },
        });
    } catch (error) {
        console.error("TrustOffer creation error:", error);
        return NextResponse.json(
            { error: "Failed to create verified offer" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/trustoffer — List all offers (optionally filter by companyName)
 * Query: ?company=Google
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const company = searchParams.get("company");

        const where = company ? { companyName: company } : {};

        const offers = await db.trustOffer.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                companyName: true,
                candidateName: true,
                roleTitle: true,
                packageLPA: true,
                status: true,
                attestationUID: true,
                signerAddress: true,
                createdAt: true,
                acceptedAt: true,
                rescindedAt: true,
            },
        });

        return NextResponse.json({ offers });
    } catch (error) {
        console.error("TrustOffer list error:", error);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}
