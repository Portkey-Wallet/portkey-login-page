import { NextResponse } from "next/server";
import queryString from "query-string";

export async function POST(request: Request) {
  const formData = await request.formData();

  const token = formData.get("token");

  return NextResponse.redirect(
    `http://127.0.0.1:53285?${queryString.stringify({
      token,
      provider: "Telegram",
    })}`
  );
}
