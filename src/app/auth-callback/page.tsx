"use client";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "src/components/Loading";
import { parseRedirectParams } from "src/utils/parseRedirectParams";

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

  const getToken = useCallback(() => {
    try {
      const { token, provider, code, message } = parseRedirectParams();

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
    } catch (error) {
      if (typeof error === "string") return setError(error);
      error && setError(JSON.stringify(error));
    }
  }, [onCloseWindow]);

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
