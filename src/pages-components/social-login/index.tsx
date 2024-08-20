"use client";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import Loading from "src/components/Loading";
import {
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
  APPLE_REDIRECT_URI_V2,
  APPLE_REDIRECT_URI_V2_ZKLOGIN,
  FACEBOOK_REDIRECT_URI,
  GG_CLIENT_ID,
  PORTKEY_VERSION,
  TWITTER_CLIENT_ID,
} from "src/constants";
import { SearchParams } from "src/types";
import { appleAuthIdToken } from "src/utils/AppleAuth";
import { getGoogleAccessToken, getGoogleAccessTokenWithZkLogin } from "src/utils/GoogleAuthReplace";
import TelegramAuth from "../telegram-auth";
import "./index.css";
import { twitterAuth } from "src/utils/twitter/TwitterAuth";
import {
  facebookAuthReplace,
  facebookAuthReplaceWithZkLogin,
} from "src/utils/Facebook/facebookAuthReplace";
import TelegramAuthSDK from "../telegram-auth-sdk";
import { useSearchParams } from "next/navigation";

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
  const nextSearchParams = useSearchParams();

  useEffect(() => {
    const { hostname, pathname, search } = location;
    const network = nextSearchParams.get("network");
    const serviceURI = nextSearchParams.get("serviceURI");

    if (
      params.authType === "Telegram" &&
      hostname === "openlogin.portkey.finance" &&
      (network === "TESTNET" || serviceURI?.includes("-test.portkey.finance"))
    ) {
      location.href = `https://openlogin-testnet.portkey.finance${pathname}${search}`;
      return;
    }

    window.addEventListener("beforeunload", onCloseWindow);
    return () => {
      window.removeEventListener("beforeunload", onCloseWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSearchParams = useCallback(() => {
    if (!searchParams || !Object.keys(searchParams).length)
      return { clientId: undefined, redirectURI: undefined, state: undefined };
    const { clientId, redirectURI, state, version, socialType, nonce, side } =
      searchParams;
    let _version: string | undefined;
    let _state: string | undefined;
    let _nonce: string | undefined;

    if (clientId && typeof clientId !== "string")
      throw setError("Invalid clientId");
    if (redirectURI && typeof redirectURI !== "string")
      throw setError("Invalid redirectURI");

    if (Array.isArray(version)) {
      _version = version?.slice(-1)[0];
    } else {
      _version = version;
    }
    if (Array.isArray(state)) {
      _state = state?.slice(-1)[0];
    } else {
      _state = state;
    }

    if (Array.isArray(nonce)) {
      _nonce = nonce?.slice(-1)[0];
    } else {
      _nonce = nonce;
    }

    return {
      clientId,
      redirectURI,
      state: _state,
      version: _version,
      socialType,
      nonce: _nonce,
      side,
    };
  }, [searchParams]);

  const getGoogleAuth = useCallback(async () => {
    const {
      clientId,
      redirectURI,
      socialType,
      nonce,
      side,
    } = checkSearchParams();
    const _clientId = clientId || GG_CLIENT_ID;
    const _path = side === "portkey" ? 'portkey-auth-callback' : 'auth-callback';
    const _redirectURI = redirectURI || `${location.origin}/${_path}`;
    window.removeEventListener("beforeunload", onCloseWindow);

    if (socialType === "zklogin") {
      getGoogleAccessTokenWithZkLogin({
        clientId: _clientId,
        redirectURI: _redirectURI,
        nonce,
      });
      return;
    }

    getGoogleAccessToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
    });
  }, [checkSearchParams, onCloseWindow]);

  const getAppleAuth = useCallback(async () => {
    const { clientId, redirectURI, state, version, nonce, socialType } = checkSearchParams();
    const _clientId = clientId || APPLE_CLIENT_ID;

    let defaultRedirectURI =
      version === PORTKEY_VERSION ? APPLE_REDIRECT_URI_V2 : APPLE_REDIRECT_URI;

    if (socialType === "zklogin") {
      defaultRedirectURI = APPLE_REDIRECT_URI_V2_ZKLOGIN;
    }

    const _redirectURI = redirectURI || defaultRedirectURI;

    window.removeEventListener("beforeunload", onCloseWindow);
    await appleAuthIdToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
      state: (state as string | undefined) ?? "origin:web",
      nonce,
    });
  }, [checkSearchParams, onCloseWindow]);

  const getFBAuth = useCallback(async () => {
    setLoading(true);

    const {
      clientId = FACEBOOK_REDIRECT_URI,
      redirectURI = "https://aa-portkey.portkey.finance/api/app/facebookAuth/receive",
      state,
      socialType,
      nonce,
    } = checkSearchParams();

    if (!redirectURI) throw setError("Invalid redirectURI");
    window.removeEventListener("beforeunload", onCloseWindow);

    if (socialType === "zklogin") {
      facebookAuthReplaceWithZkLogin({
        clientId,
        redirectURI,
        state,
        nonce,
      });
      return;
    }

    facebookAuthReplace({
      clientId,
      redirectURI,
      state,
    });
  }, [checkSearchParams, onCloseWindow]);

  const getTwitterAuth = useCallback(async () => {
    setLoading(true);

    const {
      clientId = TWITTER_CLIENT_ID,
      redirectURI = "https://aa-portkey.portkey.finance/api/app/twitterAuth/receive",
      state,
    } = checkSearchParams();

    if (!redirectURI) throw setError("Invalid redirectURI");

    window.removeEventListener("beforeunload", onCloseWindow);

    twitterAuth({
      clientId,
      redirectURI,
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
          break;
        case "Facebook":
          await getFBAuth();
          break;
        case "Twitter":
          await getTwitterAuth();
          break;
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
  }, [getAppleAuth, getFBAuth, getGoogleAuth, getTwitterAuth, params]);

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
      {params.authType === "Telegram" && searchParams.from === "portkey" ? (
        <TelegramAuth
          searchParams={searchParams}
          onCloseWindow={onCloseWindow}
          onLoadingChange={setLoading}
          onError={setError}
        />
      ) : null}

      {params.authType === "Telegram" && searchParams.from !== "portkey" ? (
        <TelegramAuthSDK
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
