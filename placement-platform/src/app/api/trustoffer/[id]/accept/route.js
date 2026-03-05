import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * PATCH /api/trustoffer/[id]/accept — Candidate accepts the offer
 */
export async function PATCH(request, { params }) {
    try {
        const { id } = await params;

        const offer = await db.trustOffer.findUnique({ where: { id } });

        if (!offer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        if (offer.status !== "Pending") {
            return NextResponse.json(
                { error: `Cannot accept — offer is already ${offer.status}` },
                { status: 400 }
            );
        }

        const updated = await db.trustOffer.update({
            where: { id },
            data: {
                status: "Accepted",
                acceptedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            offer: {
                id: updated.id,
                status: updated.status,
                acceptedAt: updated.acceptedAt,
                attestationUID: updated.attestationUID,
            },
        });
    } catch (error) {
        console.error("Accept offer error:", error);
        return NextResponse.json({ error: "Failed to accept offer" }, { status: 500 });
    }
}
