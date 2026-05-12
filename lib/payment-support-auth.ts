import { NextRequest, NextResponse } from "next/server";

const TOKEN_ENV_NAME = "PAYMENT_SUPPORT_TOKEN";

function getRequestToken(request: NextRequest): string {
  const authorization = request.headers.get("authorization") || "";
  const bearerPrefix = "Bearer ";
  if (authorization.startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim();
  }

  return request.headers.get("x-support-token")?.trim() || "";
}

export function requirePaymentSupportToken(request: NextRequest): NextResponse | null {
  const expectedToken = process.env[TOKEN_ENV_NAME]?.trim();

  if (!expectedToken) {
    console.error(`[Payment Support] Missing ${TOKEN_ENV_NAME} environment variable`);
    return NextResponse.json({ error: "Support endpoint is not configured" }, { status: 503 });
  }

  const receivedToken = getRequestToken(request);
  if (!receivedToken || receivedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
