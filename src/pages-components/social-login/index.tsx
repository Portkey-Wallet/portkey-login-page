"use client";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import Loading from "src/components/Loading";
import {
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
  GG_CLIENT_ID,
} from "src/constants";
import { SearchParams } from "src/types";
import { appleAuthIdToken } from "src/utils/AppleAuth";
import { getGoogleAccessToken } from "src/utils/GoogleAuthReplace";
import TelegramAuth from "../telegram-auth";
import "./index.css";

export default function SocialLogin({
  params,
  searchParams,
}: {
  params: { authType: string };
  searchParams: SearchParams;
}) {
  const [loading, setLoading] = React.useState(false);
  const [errorInfo, setError] = React.useState<string | null>(null);

  const onCloseWindow = useCallback(() => {
    window.opener.postMessage(
      {
        type: "PortkeySocialLoginOnFailure",
        error: "User close the prompt",
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

  const checkSearchParams = useCallback(() => {
    if (!searchParams || !Object.keys(searchParams).length)
      return { clientId: undefined, redirectURI: undefined, state: undefined };
    const { clientId, redirectURI, state } = searchParams;
    if (clientId && typeof clientId !== "string")
      throw setError("Invalid clientId");
    if (redirectURI && typeof redirectURI !== "string")
      throw setError("Invalid redirectURI");
    return { clientId, redirectURI, state };
  }, [searchParams]);

  const getGoogleAuth = useCallback(async () => {
    const { clientId, redirectURI } = checkSearchParams();
    const _clientId = clientId || GG_CLIENT_ID;
    const _redirectURI = redirectURI || `${location.origin}/auth-callback`;
    window.removeEventListener("beforeunload", onCloseWindow);

    getGoogleAccessToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
    });
  }, [checkSearchParams, onCloseWindow]);

  const getAppleAuth = useCallback(async () => {
    const { clientId, redirectURI, state } = checkSearchParams();
    const _clientId = clientId || APPLE_CLIENT_ID;
    const _redirectURI = redirectURI || APPLE_REDIRECT_URI;
    window.removeEventListener("beforeunload", onCloseWindow);

    await appleAuthIdToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
      state: (state as string | undefined) ?? "origin:web",
    });
  }, [checkSearchParams, onCloseWindow]);

  const onSuccess = useCallback(async () => {
    try {
      const { authType } = params;
      switch (authType) {
        case "Google":
          await getGoogleAuth();
          break;
        case "Apple":
          await getAppleAuth();
        case "Telegram":
          // await getTelegramAuth();
          break;
        default:
          setError("Invalid authType");
          throw "Invalid authType";
      }
    } catch (error) {
      setLoading(false);
    }
  }, [getAppleAuth, getGoogleAuth, params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      onSuccess();
    }, 300);
  }, [onSuccess]);

  return (
    <div
      className={clsx(
        "social-login-wrapper",
        params.authType === "Telegram"
          ? ""
          : "h-screen flex justify-center items-center"
      )}>
      {params.authType === "Telegram" ? (
        <TelegramAuth
          searchParams={searchParams}
          onCloseWindow={onCloseWindow}
          onLoadingChange={setLoading}
          onError={setError}
        />
      ) : null}

      <div>{errorInfo ? errorInfo : <div className=""></div>}</div>

      <Loading loading={!errorInfo && loading} />
    </div>
  );
}
