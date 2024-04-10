import { AccountTypeEnum, OperationTypeEnum } from "@portkey/services";
import { GuardianStep } from "src/constants/guardians";
import { TOpenLoginSessionInfo } from "./auth";
import type { NetworkType, UserGuardianStatus, ITelegramInfo } from "@portkey/did-ui-react";
import { ChainId, ChainType } from "@portkey/types";

export interface verificationInfo {
  id: string;
  signature?: number[];
  verificationDoc?: string;
}
export interface GuardianApprovedItem {
  value?: string;
  type: AccountTypeEnum;
  identifierHash?: string;
  verificationInfo: verificationInfo;
}

export type GuardianLocationState = TOpenLoginSessionInfo & {
  networkType: NetworkType;
  originChainId: ChainId;
  chainType: ChainType;
  caHash: string;
  guardianStep: GuardianStep;
  isErrorTip?: boolean;
  currentGuardian?: UserGuardianStatus;
  telegramInfo: ITelegramInfo;
};

export type GuardianApprovalLocationState = TOpenLoginSessionInfo & {
  networkType: NetworkType;
  originChainId: ChainId;
  targetChainId: ChainId;
  caHash?: string;
  identifier?: string;
  operationType: OperationTypeEnum;
  isErrorTip?: boolean;
};
