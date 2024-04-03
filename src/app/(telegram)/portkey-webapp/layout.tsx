"use client";
import { PortkeyProvider, ConfigProvider } from "@portkey/did-ui-react";
import { ReactNode } from "react";
import "@portkey/did-ui-react/dist/assets/index.css";
import { NETWORK_TYPE, PortkeyServiceUrl, UrlType } from "src/constants";

ConfigProvider.setGlobalConfig({
  graphQLUrl: PortkeyServiceUrl[NETWORK_TYPE][UrlType.GRAPHQL],
  requestDefaults: {
    timeout: 30000,
    baseURL: PortkeyServiceUrl[NETWORK_TYPE][UrlType.SERVICE],
  },
  serviceUrl: PortkeyServiceUrl[NETWORK_TYPE][UrlType.SERVICE],
  customNetworkType: "offline",
});

export default function PortkeyCustomProvider({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <PortkeyProvider networkType={NETWORK_TYPE} theme={"light"}>
      {children}
    </PortkeyProvider>
  );
}
