import { did, getChainInfo } from "@portkey/did-ui-react";
import { ChainId, ChainType } from "@portkey/types";
import { PortkeyUIError } from "src/constants/error";

export interface VerifierListParams {
  rpcUrl?: string;
  address?: string;
  chainType: ChainType;
  chainId: ChainId;
}

export const getVerifierList = (params: VerifierListParams) => {
  if (!did.getVerifierServers) throw Error(PortkeyUIError.noDid);
  return did.getVerifierServers(params.chainId);
};

export interface FetchVerifierProps {
  originChainId: ChainId;
  chainType?: ChainType;
}

export const getVerifierListHandler = async ({
  originChainId,
  chainType,
}: FetchVerifierProps) => {
  const chainInfo = await getChainInfo(originChainId);
  if (!chainInfo) return;
  const list = await getVerifierList({
    chainId: originChainId,
    rpcUrl: chainInfo.endPoint,
    chainType: chainType ?? "aelf",
    address: chainInfo.caContractAddress,
  });
  return list;
};
