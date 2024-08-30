import React, { useCallback, useEffect, useState } from "react";
import Loading from "src/components/Loading";
import {
  APPLE_CLIENT_ID,
  APPLE_OPEN_LOGIN_REDIRECT_URI,
  FACEBOOK_OPEN_LOGIN_REDIRECT_URI,
  FACEBOOK_REDIRECT_URI,
  GG_CLIENT_ID,
} from "src/constants";
import { OpenLoginParamConfig } from "src/types/auth";
import { appleAuthIdToken } from "src/utils/AppleAuth";
import { facebookAuthReplace } from "src/utils/Facebook/facebookAuthReplace";
import { getGoogleAccessToken } from "src/utils/GoogleAuthReplace";
import TelegramAuthUpgraded from "../telegram-auth-upgraded";
import { SOCIAL_AUTH_SESSION_KEY } from "src/constants/social";
import clsx from "clsx";
import "./index.css";
import { TwitterAuthV1 } from "src/utils/twitter/TwitterAuthV1";
import TonAuth from "../ton-auth";
import { SearchParams } from "src/types";

export default function SocialAuth({
  authInfo,
  searchParams,
}: {
  authInfo: OpenLoginParamConfig;
  searchParams: SearchParams;
}) {
  const [errorInfo, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // save session
    sessionStorage.setItem(
      SOCIAL_AUTH_SESSION_KEY,
      JSON.stringify({
        loginId: authInfo.loginId,
        publicKey: authInfo.publicKey,
        serviceURI: authInfo.serviceURI,
        isFromTelegram: authInfo.isFromTelegram,
      })
    );
  }, [
    authInfo.loginId,
    authInfo.publicKey,
    authInfo.serviceURI,
    authInfo.isFromTelegram,
  ]);

  const getGoogleAuth = useCallback(async () => {
    const { clientId } = authInfo;
    const _clientId = clientId || GG_CLIENT_ID;
    const redirectURI = `${location.origin}/auth-callback`;
    console.log(location.origin);
    setLoading(true);

    getGoogleAccessToken({
      clientId: _clientId,
      redirectURI,
    });
  }, [authInfo]);

  const getAppleAuth = useCallback(async () => {
    const { clientId, serviceURI, state } = authInfo;
    const _clientId = clientId || APPLE_CLIENT_ID;

    const _redirectURI = `${serviceURI}${APPLE_OPEN_LOGIN_REDIRECT_URI}`;
    setLoading(true);

    await appleAuthIdToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
      state: (state as string | undefined) ?? "origin:web",
    });
  }, [authInfo]);

  const getFBAuth = useCallback(async () => {
    setLoading(true);

    const { clientId = FACEBOOK_REDIRECT_URI, serviceURI, state } = authInfo;

    const redirectURI = `${serviceURI}${FACEBOOK_OPEN_LOGIN_REDIRECT_URI}`;

    facebookAuthReplace({
      clientId,
      redirectURI,
      state,
    });
  }, [authInfo]);

  const getTwitterAuth = useCallback(() => {
    setLoading(true);
    const { serviceURI } = authInfo;

    TwitterAuthV1(serviceURI);
  }, [authInfo]);

  const formatAuth = useCallback(async () => {
    try {
      switch (authInfo.loginProvider) {
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
          getTwitterAuth();
          break;
        case "Telegram":
          // await getTelegramAuth();
          break;
        case "TonWallet":
          break;
        default:
          setError("Invalid authType");
          throw "Invalid authType";
      }
    } catch (error) {
      setLoading(false);

      setError(typeof error === "string" ? error : "Social Auth error");
    }
  }, [
    authInfo.loginProvider,
    getAppleAuth,
    getFBAuth,
    getGoogleAuth,
    getTwitterAuth,
  ]);

  useEffect(() => {
    formatAuth();
  }, [formatAuth]);

  return (
    <div
      className={clsx(
        "social-login-wrapper",
        authInfo.loginProvider === "Telegram" && !errorInfo
          ? ""
          : "h-screen flex justify-center items-center"
      )}
    >
      {authInfo.loginProvider === "Telegram" && !errorInfo ? (
        <TelegramAuthUpgraded
          authInfo={authInfo}
          onLoadingChange={setLoading}
          onError={setError}
        />
      ) : null}
      {authInfo.loginProvider === "TonWallet" && !errorInfo ? (
        <TonAuth
          onLoadingChange={setLoading}
          onError={setError}
          searchParams={searchParams}
        />
      ) : null}
      <div>{errorInfo ? errorInfo : <div className=""></div>}</div>

      <Loading loading={!errorInfo && loading} />
    </div>
  );
}
