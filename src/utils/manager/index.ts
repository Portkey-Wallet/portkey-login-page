import { aelf } from "@portkey/accounts";
import { did, isEmpty } from "@portkey/did-ui-react";
import { OperationTypeEnum } from "@portkey/services";

export function getManagementAccount() {
  if (!isEmpty(did.didWallet.caInfo))
    console.warn(
      "Portkey wallet information already exists, please clear the cache and log in to register."
    );
  if (!did.didWallet.managementAccount) did.create();
  return did.didWallet.managementAccount as aelf.WalletAccount;
}

export function getOperationDetails(operationType: OperationTypeEnum) {
  if (
    operationType === OperationTypeEnum.register ||
    operationType === OperationTypeEnum.communityRecovery
  ) {
    return JSON.stringify({ manager: getManagementAccount().address });
  }
  return "{}";
}
