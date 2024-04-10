"use client";
import { ConfigProvider, PortkeyStyleProvider } from "@portkey/did-ui-react";
import type { NetworkType } from "@portkey/did-ui-react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getPortkeyServiceUrl } from "src/utils/common";
import { UrlType } from "src/constants";
import { base64toJSON } from "src/utils";

type TGuardianLayoutLocationState = { networkType: NetworkType };

export default function GuardianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  // search params
  const b64Params = searchParams.get("b64Params") || "";
  const pageInfo: TGuardianLayoutLocationState = useMemo(() => {
    try {
      const data = base64toJSON(b64Params);
      return data as TGuardianLayoutLocationState;
    } catch (error) {
      return { networkType: "MAINNET" };
    }
  }, [b64Params]);

  ConfigProvider.setGlobalConfig({
    requestDefaults: {
      timeout: 30000,
      baseURL: getPortkeyServiceUrl({
        networkType: pageInfo.networkType,
        urlType: UrlType.SERVICE,
      }),
    },
    serviceUrl: getPortkeyServiceUrl({
      networkType: pageInfo.networkType,
      urlType: UrlType.SERVICE,
    }),
    connectUrl: getPortkeyServiceUrl({
      networkType: pageInfo.networkType,
      urlType: UrlType.CONNECT,
    }),
    graphQLUrl: getPortkeyServiceUrl({
      networkType: pageInfo.networkType,
      urlType: UrlType.GRAPHQL,
    }),
  });

  return <PortkeyStyleProvider>{children}</PortkeyStyleProvider>;
}
