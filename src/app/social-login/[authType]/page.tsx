"use client";
import SocialLogin from "src/pages-components/social-login";
import { SearchParams } from "src/types";

export default function Page({
  params,
  searchParams,
}: {
  params: { authType: string };
  searchParams: SearchParams;
}) {
  return (
    <div>
      <SocialLogin params={params} searchParams={searchParams} />
    </div>
  );
}
