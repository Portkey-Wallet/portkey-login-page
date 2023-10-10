import { NextResponse } from "next/server";
import queryString from "query-string";

export async function POST(request: Request) {
  const body = await request.json();

  const token = body.id_token;

  return NextResponse.redirect(
    `http://localhost:8123?${queryString.stringify({
      token,
      provider: "Apple",
    })}`
  );
}
