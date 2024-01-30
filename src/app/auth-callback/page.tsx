"use client";
import React, { useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import Loading from "src/components/Loading";

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
    let token;
    let provider;
    if (location.hash) {
      const searchParams = queryString.parse(location.hash);
      token = searchParams.access_token;
      if (!token) return setError("Invalid token access_token in query string");
      provider = "Google";
    } else if (location.search) {
      const {
        id_token,
        type,
        token: authToken,
      } = queryString.parse(location.search);
      if (type === "telegram") {
        token = authToken;
        provider = "Telegram";
      } else if (authToken) {
        token = authToken;
        provider = type;
      } else {
        if (!id_token)
          return setError("Invalid token id_token in query string");
        token = id_token;
        provider = "Apple";
      }
    } else {
      return setError("Invalid token  in query string");
    }
    if (!window.opener?.postMessage)
      return setError("The current browser is abnormal or not supported");
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
  }, []);

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
