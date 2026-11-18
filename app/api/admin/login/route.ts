import { NextResponse } from "next/server";
import { makeAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials are not configured" },
        { status: 500 }
      );
    }

    if (
      String(email ?? "").trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
      String(password ?? "") !== adminPassword
    ) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
    });

    response.cookies.set("admin_session", makeAdminToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
