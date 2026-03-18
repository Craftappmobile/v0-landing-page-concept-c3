import { NextRequest, NextResponse } from "next/server";

/**
 * Hutko redirects the user back via POST after payment.
 * This handler accepts the POST and redirects the user to the checkout success page via GET.
 */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/checkout?status=done`, {
    status: 303, // 303 See Other — forces GET on redirect
  });
}

/** Also handle GET in case Hutko or user navigates directly */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/checkout?status=done`, {
    status: 303,
  });
}

