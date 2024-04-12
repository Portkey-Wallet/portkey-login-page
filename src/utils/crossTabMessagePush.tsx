import { modalMethod } from "@portkey/did-ui-react";
import { forgeWeb, sleep } from "@portkey/utils";
import { Toast } from "src/components/Toast/ToastShow";
import { TOpenLoginSessionInfo } from "src/types/auth";
import { tabMessagePushApi } from "src/utils/request";

export type TPushMessageByApiParams = {
  serviceURI: string;
  loginId: string;
  data: string;
};

export enum CrossTabPushMessageType {
  onAuthStatusChanged = "onAuthStatusChanged",
  onSetLoginGuardianResult = "onSetLoginGuardianResult",
  onAddGuardianResult = "onAddGuardianResult",
  onRemoveGuardianResult = "onRemoveGuardianResult",
  onEditGuardianResult = "onEditGuardianResult",
  onGuardianApprovalResult = "onGuardianApprovalResult",
  onCheckSellResult = "onCheckSellResult",
}

export type TPushMessageByApi = {
  methodName: CrossTabPushMessageType;
  params: TPushMessageByApiParams;
  times?: number;
};

export const pushMessageByApi = async ({
  methodName,
  params,
  times = 0,
}: TPushMessageByApi): Promise<any> => {
  const { serviceURI, loginId, data } = params;

  try {
    return await tabMessagePushApi({
      url: `${serviceURI}/api/app/tab/complete`,
      params: {
        clientId: loginId,
        methodName: methodName,
        data: data,
        needPersist: true,
      },
    });
  } catch (error: any) {
    console.log(error?.message);
    const currentTimes = ++times;
    await sleep(500);
    if (currentTimes > 5) {
      const err = error?.message || "Network error";
      Toast.show(err);
      throw err;
    }

    return pushMessageByApi({ methodName, params, times: currentTimes });
  }
};

export const pushEncodeMessage = async (
  storage: string,
  methodName: CrossTabPushMessageType,
  params: string,
  needPrompt = false
) => {
  const sessionInfo = (JSON.parse(storage) || {}) as TOpenLoginSessionInfo;
  const { serviceURI, publicKey, loginId } = sessionInfo;
  console.log(serviceURI, publicKey, loginId, params);
  let encrypted;
  try {
    const cryptoManager = new forgeWeb.ForgeCryptoManager();
    encrypted = await cryptoManager.encryptLong(publicKey, params);
  } catch (error) {
    throw "Failed to encrypt user token";
  }

  await pushMessageByApi({
    methodName,
    params: {
      serviceURI: sessionInfo.serviceURI,
      loginId: sessionInfo.loginId,
      data: encrypted,
    },
  });
  if (needPrompt) {
    modalMethod({
      wrapClassName: "common-prompt-modal",
      content: (
        <div className='common-prompt-modal-body'>
          {/* TODO: adjust text */}
          <div className='common-prompt-modal-title'>Account Verified</div>
          <div className='common-prompt-modal-content'>
            Your account has been successfully verified. Please go back to
            Telegram to continue.
          </div>
        </div>
      ),
    });
  }
};
