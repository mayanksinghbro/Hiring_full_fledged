import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateReputation } from "@/lib/blockchain";

/**
 * GET /api/trustoffer/reputation?company=Google
 * Returns a company's on-chain reputation score
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const company = searchParams.get("company");

        if (!company) {
            return NextResponse.json(
                { error: "Missing required query param: company" },
                { status: 400 }
            );
        }

        const offers = await db.trustOffer.findMany({
            where: { companyName: company },
            select: { status: true },
        });

        const stats = {
            total: offers.length,
            pending: offers.filter((o) => o.status === "Pending").length,
            accepted: offers.filter((o) => o.status === "Accepted").length,
            rescinded: offers.filter((o) => o.status === "Rescinded").length,
        };

        const reputation = calculateReputation(stats);

        return NextResponse.json({
            company,
            stats,
            reputation,
        });
    } catch (error) {
        console.error("Reputation error:", error);
        return NextResponse.json(
            { error: "Failed to calculate reputation" },
            { status: 500 }
        );
    }
}
