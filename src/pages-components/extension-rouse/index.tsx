"use client";
import React, { useEffect } from "react";
import { ExtensionRouseParams } from "src/types";

export default function ExtensionRouse({
  params,
}: {
  params?: ExtensionRouseParams;
}) {
  useEffect(() => {
    if (!params?.method) return;
    window.portkey_did?.request(params);
  }, [params]);

  return <div className="h-screen flex justify-center items-center"></div>;
}
