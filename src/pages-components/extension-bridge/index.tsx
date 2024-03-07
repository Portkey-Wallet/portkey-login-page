"use client";
import React, { useCallback, useEffect } from "react";
import qs from "query-string";
import { ExtensionBridgeParams } from "src/types";
import { PORTKEY_VERSION } from "src/constants";

export default function ExtensionBridge() {
  const portkeyProvider = useCallback(() => {
    const { version } = qs.parse(location.search);
    const isPortkeyV2 = version === PORTKEY_VERSION;
    return isPortkeyV2 ? window.Portkey : window.portkey;
  }, []);

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
      const provider = portkeyProvider();
      if ((params as any)?.verison) delete (params as any)?.verison;
      await provider?.request(params);
    } catch (error) {
      console.log("error", error);
    } finally {
      window.close();
      console.log("close window");
    }
  }, [portkeyProvider]);

  useEffect(() => {
    const provider = portkeyProvider();
    if (!provider) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        if (!portkeyProvider()) {
          console.log(
            "Timeout, please download and install the Portkey extension"
          );
        }
        handler();
      }, 500);
      return;
    }
    handler();
  }, [handler, portkeyProvider]);

  return <div className="h-screen flex justify-center items-center"></div>;
}
