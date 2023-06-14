"use client";
import React, { useCallback, useEffect } from "react";
import qs from "query-string";
import { ExtensionBridgeParams } from "src/types";

export default function ExtensionBridge() {
  const handler = useCallback(async () => {
    const params = qs.parse(window.location.search) as ExtensionBridgeParams;
    console.log("ExtensionBridge origin, params:", params);

    if (!params?.method) return;
    if (params?.payload) {
      try {
        params.payload = JSON.parse(params.payload);
      } catch (error) {
        console.log(error);
      }
    }

    console.log("ExtensionBridge handler, params:", params);
    try {
      await window.portkey?.request(params);
    } catch (error) {
      console.log("error", error);
    } finally {
      window.close();
      console.log("close window");
    }
  }, []);

  useEffect(() => {
    console.log("ExtensionBridge useEffect");
    if (!window.portkey) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        if (!window.portkey) {
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
