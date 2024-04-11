import {
  GuardianApprovalLocationState,
  GuardianLocationState,
} from "src/types/guardians";

export const GUARDIAN_VIEW_SESSION_KEY = "guardian-view-session-key";

export const GUARDIAN_ADD_SESSION_KEY = "guardian-add-session-key";

export const GUARDIAN_EDIT_SESSION_KEY = "guardian-edit-session-key";

export const GUARDIAN_REMOVE_SESSION_KEY = "guardian-remove-session-key";

export const GUARDIAN_APPROVAL_SESSION_KEY = "guardian-approval-session-key";

export const MaxVerifierNumber = 100;

export enum GuardianStep {
  guardianAdd = "guardianAdd",
  guardianEdit = "guardianEdit",
  guardianView = "guardianView",
}

export const DefaultGuardianLocationState: GuardianLocationState = {
  networkType: "MAINNET",
  originChainId: "AELF",
  chainType: "aelf",
  caHash: "",
  guardianStep: GuardianStep.guardianView,
  loginId: "",
  publicKey: "",
  serviceURI: "",
  currentGuardian: {
    isLoginGuardian: false,
    guardianType: "Google",
    key: "",
  },
  telegramInfo: {
    accessToken: "",
    userId: "",
  }
};

export const DefaultGuardianApprovalLocationState: GuardianApprovalLocationState =
  {
    networkType: "MAINNET",
    originChainId: "AELF",
    targetChainId: "AELF",
    caHash: "",
    identifier: "",
    operationType: 0,
    loginId: "",
    publicKey: "",
    serviceURI: "",
  };
