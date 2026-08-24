import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.item.findFirst();
    return NextResponse.json({ status: "ok", checkedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
