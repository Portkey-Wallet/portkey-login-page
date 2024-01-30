"use client";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import Loading from "src/components/Loading";
import {
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
  APPLE_REDIRECT_URI_V2,
  FACEBOOK_REDIRECT_URI,
  GG_CLIENT_ID,
  PORTKEY_VERSION,
  TWITTER_CLIENT_ID,
} from "src/constants";
import { SearchParams } from "src/types";
import { appleAuthIdToken } from "src/utils/AppleAuth";
import { getGoogleAccessToken } from "src/utils/GoogleAuthReplace";
import TelegramAuth from "../telegram-auth";
import "./index.css";
import { twitterAuth } from "src/utils/twitter/TwitterAuth";
import { facebookAuthReplace } from "src/utils/Facebook/facebookAuthReplace";

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
    const { clientId, redirectURI, state, version } = searchParams;
    let _version: string | undefined;
    let _state: string | undefined;

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

    return { clientId, redirectURI, state: _state, version: _version };
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
    const { clientId, redirectURI, state, version } = checkSearchParams();
    const _clientId = clientId || APPLE_CLIENT_ID;

    const defaultRedirectURI =
      version === PORTKEY_VERSION ? APPLE_REDIRECT_URI_V2 : APPLE_REDIRECT_URI;

    const _redirectURI = redirectURI || defaultRedirectURI;

    window.removeEventListener("beforeunload", onCloseWindow);

    await appleAuthIdToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
      state: (state as string | undefined) ?? "origin:web",
    });
  }, [checkSearchParams, onCloseWindow]);

  const getFBAuth = useCallback(async () => {
    setLoading(true);

    const {
      clientId = FACEBOOK_REDIRECT_URI,
      redirectURI = "https://test4-applesign-v2.portkey.finance/api/app/facebookAuth/receive",
      state,
      version,
    } = checkSearchParams();

    if (!redirectURI) throw setError("Invalid redirectURI");

    window.removeEventListener("beforeunload", onCloseWindow);
    facebookAuthReplace({
      clientId,
      redirectURI,
      state,
      version,
    });
  }, [checkSearchParams, onCloseWindow]);

  const getTwitterAuth = useCallback(async () => {
    setLoading(true);

    const {
      clientId = TWITTER_CLIENT_ID,
      redirectURI = "https://test3-applesign-v2.portkey.finance/api/app/twitterAuth/receive",
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
      {/* <button onClick={getFBAuth}>getFBAuth</button>
      <div style={{ width: 200 }}></div>
      <button
        onClick={() => {
          const FB = (window as any).FB;
          FB.login(function (response: any) {
            if (response.authResponse) {
              console.log("Welcome!  Fetching your information.... ");
              FB.api("/me", function (response: any) {
                console.log("Good to see you, " + response.name + ".");
              });
            } else {
              console.log("User cancelled login or did not fully authorize.");
            }
          });
        }}>
        getFBAuth1
      </button>
      <div style={{ width: 200 }}></div>

      <button
        onClick={() => {
          getTwitterAuth();
          // twitterAuth({
          //   clientId: "VE5DRUl1bHdoeHN0cW9POEpEYlY6MTpjaQ",
          //   redirectURI: "https://portkey.finance/",
          // });
        }}>
        twitterAuth
      </button>
      <div style={{ width: 200 }}></div>
      <button
        onClick={async () => {
          facebookAuthReplace({
            clientId: "1061123428463627",
            redirectURI: "https://portkey.finance/",
          });
        }}>
        facebookAuthReplace
      </button> */}
    </div>
  );
}
