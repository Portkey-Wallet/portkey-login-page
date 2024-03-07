"use client";
import React, { useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import Loading from "src/components/Loading";

export default function AuthCallback() {
  const [error, setError] = useState<string>();

  const getToken = useCallback(() => {
    let token;
    let provider;
    if (location.search) {
      const searchParams = queryString.parse(location.search);
      token = searchParams.token;
      if (!token) return setError("Missing token in query string");
      provider = "Telegram";

      if (!!window) {
        window.location.href = `http://127.0.0.1:53285?${queryString.stringify({
          token,
          provider,
        })}`;
      }
    } else {
      return setError("Missing token in query string");
    }
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
