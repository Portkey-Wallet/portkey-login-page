"use client";
import {
  PortkeyProvider,
  ConfigProvider,
  NetworkType,
} from "@portkey/did-ui-react";
import { ReactNode, useRef } from "react";
import "@portkey/did-ui-react/dist/assets/index.css";
import { PortkeyServiceUrl, UrlType } from "src/constants";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function PortkeyCustomProvider({
  children,
}: {
  children?: ReactNode;
}) {
  const searchParams = useSearchParams();
  const networkType = useRef(
    (searchParams.get("networkType") as NetworkType) || "MAINNET"
  );

  ConfigProvider.setGlobalConfig({
    graphQLUrl: PortkeyServiceUrl[networkType.current][UrlType.GRAPHQL],
    requestDefaults: {
      timeout: 30000,
      baseURL: PortkeyServiceUrl[networkType.current][UrlType.SERVICE],
    },
    serviceUrl: PortkeyServiceUrl[networkType.current][UrlType.SERVICE],
    customNetworkType: "offline",
  });

  return (
    <PortkeyProvider networkType={networkType.current} theme={"light"}>
      <Script src="https://telegram.org/js/telegram-web-app.js" />
      {children}
    </PortkeyProvider>
  );
}
