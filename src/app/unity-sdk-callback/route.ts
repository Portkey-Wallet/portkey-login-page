import { NextResponse } from "next/server";
import queryString from "query-string";

export async function POST(request: Request) {
  const body = await request.json();

  const token = body.id_token;
  const port = body.state;

  return NextResponse.redirect(
    `http://localhost:${port}?${queryString.stringify({
      token,
      provider: "Apple",
    })}`
  );
}
