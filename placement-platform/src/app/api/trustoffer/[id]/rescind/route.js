import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * PATCH /api/trustoffer/[id]/rescind — Company rescinds the offer (reputation hit)
 */
export async function PATCH(request, { params }) {
    try {
        const { id } = await params;

        const offer = await db.trustOffer.findUnique({ where: { id } });

        if (!offer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        if (offer.status === "Rescinded") {
            return NextResponse.json(
                { error: "Offer is already rescinded" },
                { status: 400 }
            );
        }

        const updated = await db.trustOffer.update({
            where: { id },
            data: {
                status: "Rescinded",
                rescindedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            offer: {
                id: updated.id,
                status: updated.status,
                rescindedAt: updated.rescindedAt,
                attestationUID: updated.attestationUID,
            },
            warning: "⚠️ This rescission is permanently recorded and affects your company reputation.",
        });
    } catch (error) {
        console.error("Rescind offer error:", error);
        return NextResponse.json({ error: "Failed to rescind offer" }, { status: 500 });
    }
}
