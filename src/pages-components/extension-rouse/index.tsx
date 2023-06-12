"use client";
import React, { useCallback, useEffect } from "react";
import { ExtensionRouseParams } from "src/types";

export default function ExtensionRouse({
  params,
}: {
  params?: ExtensionRouseParams;
}) {
  const handler = useCallback(() => {
    console.log("ExtensionRouse handler, params:", params);
    if (!params?.method) return;
    window.portkey_did?.request(params);
  }, [params]);

  useEffect(() => {
    console.log("ExtensionRouse useEffect");
    if (!window.portkey_did) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        if (!window.portkey_did) {
          console.log(
            "Timeout, please download and install the Portkey extension"
          );
        }
        handler();
      }, 500);
      return;
    }
    handler();
  }, [handler]);

  return <div className="h-screen flex justify-center items-center"></div>;
}
