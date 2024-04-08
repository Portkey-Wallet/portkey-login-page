import { did } from "@portkey/did-ui-react";
import { VerifierItem } from "@portkey/did";
import {
  AccountType,
  AccountTypeEnum,
  GuardiansApproved,
  Guardian,
} from "@portkey/services";
import { FetchVerifierProps, getVerifierListHandler } from "./verifier";
import { GuardianApprovedItem } from "src/types/guardians";

export const getGuardianList = async ({
  identifier,
  originChainId,
  caHash,
  ...props
}: { identifier?: string; caHash?: string } & FetchVerifierProps) => {
  if (!(caHash || identifier)) throw "Param is not valid";
  const verifierList = await getVerifierListHandler({
    originChainId,
    ...props,
  });
  if (!verifierList) throw "Fetch verifier list error";
  const verifierMap: { [x: string]: VerifierItem } = {};
  verifierList?.forEach((item) => {
    verifierMap[item.id] = item;
  });

  const params = identifier
    ? {
        loginGuardianIdentifier: identifier.replaceAll(/\s/g, ""),
      }
    : {
        caHash,
      };

  const payload = await did.getHolderInfo(
    Object.assign(params, { chainId: originChainId })
  );

  const { guardians } = payload?.guardianList ?? { guardians: [] };

  return guardians.map((_guardianAccount) => {
    const key = `${_guardianAccount.guardianIdentifier}&${_guardianAccount.verifierId}`;

    const guardianAccount =
      _guardianAccount.guardianIdentifier || _guardianAccount.identifierHash;
    const verifier = verifierMap?.[_guardianAccount.verifierId];

    const baseGuardian: Guardian & {
      verifier?: VerifierItem;
      key: string;
      identifier: string;
      guardianType: AccountType;
    } = {
      ..._guardianAccount,
      key,
      verifier,
      identifier: guardianAccount,
      guardianType: _guardianAccount.type,
    };

    return baseGuardian;
  });
};

export const formatGuardianValue = (approvalInfo?: GuardiansApproved[]) => {
  const guardiansApproved: GuardianApprovedItem[] =
    approvalInfo?.map((item) => ({
      type: AccountTypeEnum[item.type as AccountType],
      identifierHash: item?.identifierHash,
      verificationInfo: {
        id: item.verifierId,
        signature: Object.values(
          Buffer.from(item?.signature as any, "hex")
        ) as any,
        verificationDoc: item.verificationDoc,
      },
    })) || [];
  return guardiansApproved;
};
