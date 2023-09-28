"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { protocol: string; hostname: string; port: string };
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    window.location.replace(
      `${params.protocol}://${params.hostname}:${
        params.port
      }?${searchParams.toString()}`
    );
  }, [params]);

  return <p>Redirecting...</p>;
}
