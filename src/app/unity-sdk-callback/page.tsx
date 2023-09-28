"use client";
import React, { useCallback, useEffect, useState } from "react";
import queryString from "query-string";
import Loading from "src/components/Loading";

export default function UnitySdkCallback() {
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
      const { id_token } = queryString.parse(location.search);
      if (!id_token) return setError("Invalid token id_token in query string");
      token = id_token;
      provider = "Apple";
    } else {
      return setError("Invalid token  in query string");
    }

    window.location.assign(
      `http://localhost:8123?${queryString.stringify({ token, provider })}`
    );

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
