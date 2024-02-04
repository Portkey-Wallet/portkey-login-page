"use client";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "src/components/Loading";
import { parseRedirectParams } from "src/utils/parseRedirectParams";

export default function AuthCallback() {
  const [error, setError] = useState<string>();

  const getToken = useCallback(() => {
    try {
      const { token, provider, code, message } = parseRedirectParams();
      if (!window.Portkey)
        throw "Timeout, please download and install the Portkey extension";
      if (code) {
        window.Portkey?.request({
          method: "portkey_socialLogin",
          payload: {
            error: { code, message },
          },
        });

        return;
      }
      window.Portkey?.request({
        method: "portkey_socialLogin",
        payload: {
          response: {
            access_token: token,
            provider,
          },
        },
      });
    } catch (error) {
      if (typeof error === "string") return setError(error);
      error && setError(JSON.stringify(error));
    }
  }, []);

  useEffect(() => {
    if (!window.Portkey) {
      const ids = setTimeout(() => {
        clearTimeout(ids);
        if (!window.Portkey)
          return setError(
            "Timeout, please download and install the Portkey extension"
          );
        getToken();
      }, 500);
      return;
    }
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
