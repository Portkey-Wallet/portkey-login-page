import type { NetworkType } from "@portkey/did-ui-react";
import { PortkeyServiceUrl, UrlType } from "src/constants";

export type TGetUrl = {
  networkType: NetworkType;
  urlType?: UrlType;
  url?: string;
  onError?: (error: string) => void;
};

export const getPortkeyServiceUrl = ({
  networkType,
  urlType = UrlType.SERVICE,
  url,
  onError,
}: TGetUrl) => {
  // check url type
  if (url && typeof url) return url;

  // check network
  if (networkType && typeof networkType !== "string" && onError)
    throw onError?.("Invalid network");
  if (networkType && typeof networkType !== "string" && !onError)
    throw Error("Invalid network");

  return networkType === "TESTNET"
    ? PortkeyServiceUrl.TESTNET[urlType]
    : PortkeyServiceUrl.MAINNET[urlType];
};
