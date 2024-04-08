"use client";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "src/components/Loading";
import { SOCIAL_AUTH_SESSION_KEY } from "src/constants/social";
import { parseRedirectParams } from "src/utils/parseRedirectParams";
import {
  CrossTabPushMessageType,
  pushEncodeMessage,
} from "src/utils/crossTabMessagePush";
import { Toast } from "src/components/Toast/ToastShow";

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

  const postMessageByApi = useCallback(
    async (storage: string, params: string) => {
      return pushEncodeMessage(
        storage,
        CrossTabPushMessageType.onAuthStatusChanged,
        params
      );
    },
    []
  );

  const getToken = useCallback(async () => {
    try {
      const params = parseRedirectParams({ from: "openlogin" });

      const { token, provider, code, message } = params;

      const session = sessionStorage.getItem(SOCIAL_AUTH_SESSION_KEY);

      const infoStr = JSON.stringify(params);

      if (session) {
        await postMessageByApi(session, infoStr);
        // TODO tg - change text
        Toast.show("Authorization successful, please back to Telegram");
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
