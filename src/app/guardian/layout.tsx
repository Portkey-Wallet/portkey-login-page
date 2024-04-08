"use client";
import {
  ConfigProvider,
  PortkeyStyleProvider,
} from "@portkey/did-ui-react";
import type { NetworkType } from "@portkey/did-ui-react";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getPortkeyServiceUrl } from "src/utils/common";
import { UrlType } from "src/constants";

export default function GuardianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  // search params
  const networkType = useRef(searchParams.get("networkType") as NetworkType);

  ConfigProvider.setGlobalConfig({
    requestDefaults: {
      timeout: 30000,
      baseURL: getPortkeyServiceUrl({
        networkType: networkType.current,
        urlType: UrlType.SERVICE,
      }),
    },
    serviceUrl: getPortkeyServiceUrl({
      networkType: networkType.current,
      urlType: UrlType.SERVICE,
    }),
    connectUrl: getPortkeyServiceUrl({
      networkType: networkType.current,
      urlType: UrlType.CONNECT,
    }),
    graphQLUrl: getPortkeyServiceUrl({
      networkType: networkType.current,
      urlType: UrlType.GRAPHQL,
    }),
  });

  return <PortkeyStyleProvider>{children}</PortkeyStyleProvider>;
}
