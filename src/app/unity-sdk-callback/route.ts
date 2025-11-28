import { NextResponse } from "next/server";
import queryString from "query-string";

export async function POST(request: Request) {
  const formData = await request.formData();

  const token = formData.get("id_token");
  const port = formData.get("state");

  return NextResponse.redirect(
    `http://localhost:${port}?${queryString.stringify({
      token,
      provider: "Apple",
    })}`
  );
}
