"use client";
import { sleep } from "@portkey/utils";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "src/components/Loading";
import { Toast } from "src/components/Toast/ToastShow";
import { SOCIAL_AUTH_SESSION_KEY } from "src/constants/social";
import { TOpenloginSessionInfo } from "src/types/auth";
import { parseRedirectParams } from "src/utils/parseRedirectParams";
import { tabMessagePush } from "src/utils/request";
import { forgeWeb } from "@portkey/utils";

export default function AuthCallback() {
  const [error, setError] = useState<string>();
  const onCloseWindow = useCallback(() => {
    if (!window.opener?.postMessage)
      return setError("The current browser is abnormal or not supported");
    window.opener.postMessage(
      {
        type: "PortkeySocialLoginOnFailure",
        error: "user close the prompt",
      },
      "*"
    );
  }, []);
  useEffect(() => {
    window.addEventListener("beforeunload", onCloseWindow);
    return () => {
      window.removeEventListener("beforeunload", onCloseWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (
      params: {
        serviceURI: string;
        loginId: string;
        data: string;
      },
      times = 0
    ): Promise<any> => {
      const { serviceURI, loginId, data } = params;

      try {
        return await tabMessagePush({
          url: `${serviceURI}/api/app/tab/complete`,
          params: {
            clientId: loginId,
            methodName: "onAuthStatusChanged",
            data: data,
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

        return sendMessage(params, currentTimes);
      }
    },
    []
  );

  const postMessageByApi = useCallback(
    async (storage: string, params: string) => {
      const sessionInfo = (JSON.parse(storage) || {}) as TOpenloginSessionInfo;
      const { serviceURI, publicKey, loginId } = sessionInfo;
      console.log(serviceURI, publicKey, loginId, params);
      let encrypted;
      try {
        const cryptoManager = new forgeWeb.ForgeCryptoManager();
        encrypted = await cryptoManager.encryptLong(publicKey, params);
      } catch (error) {
        throw "Failed to encrypt user token";
      }

      await sendMessage({
        serviceURI: sessionInfo.serviceURI,
        loginId: sessionInfo.loginId,
        data: encrypted,
      });
    },
    [sendMessage]
  );

  const getToken = useCallback(async () => {
    try {
      const params = parseRedirectParams({ from: "openlogin" });

      const { token, provider, code, message } = params;

      const session = sessionStorage.getItem(SOCIAL_AUTH_SESSION_KEY);

      const infoStr = JSON.stringify(params);

      if (session) {
        await postMessageByApi(session, infoStr);
        return;
      }

      if (!window.opener?.postMessage)
        throw "The current browser is abnormal or not supported";
      if (code) {
        window.opener.postMessage(
          {
            type: "PortkeySocialLoginOnFailure",
            error: message || "auth error",
          },
          "*"
        );

        return;
      }
      window.opener.postMessage(
        {
          type: "PortkeySocialLoginOnSuccess",
          data: {
            token,
            provider,
          },
        },
        "*"
      );
      window.removeEventListener("beforeunload", onCloseWindow);
      window.close();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (error: any) {
      if (typeof error === "string") return setError(error);
      if (typeof error.message === "string") return setError(error.message);
      error && setError(JSON.stringify(error));
    }
  }, [onCloseWindow, postMessageByApi]);

  useEffect(() => {
    getToken();
  }, [getToken]);
  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div>
          <Loading loading loadingText="Please do not reload the page." />
        </div>
      )}
    </div>
  );
}

// Don't close this tab! You will be redirected back to this tab on completing login.
