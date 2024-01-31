"use client";
import React, { useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import Loading from "src/components/Loading";

export default function AuthCallback() {
  const [error, setError] = useState<string>();

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
        id,
        name,
        username,
        userId,
        expiresTime,
      } = queryString.parse(location.search);
      if (type === "telegram") {
        token = authToken;
        provider = "Telegram";
      } else if (type === "Twitter") {
        token = JSON.stringify({
          token: authToken,
          id,
          type,
          name,
          username,
        });
        provider = "type";
      } else if (type === "Facebook") {
        token = JSON.stringify({
          token: authToken,
          userId,
          expiresTime,
        });
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
    if (!window.Portkey)
      return setError(
        "Timeout, please download and install the Portkey extension"
      );

    window.Portkey?.request({
      method: "portkey_socialLogin",
      payload: {
        response: {
          access_token: token,
          provider,
        },
      },
    });
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
