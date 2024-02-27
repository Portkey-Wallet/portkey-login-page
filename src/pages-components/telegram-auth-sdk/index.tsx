import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  MAINNET_SERVICE_URL,
  TELEGRAM_REDIRECT_URI,
  TESTNET_SERVICE_URL,
} from "src/constants";
import { SearchParams } from "src/types";
import "./index.css";
import { telegramAuthAccessToken } from "src/utils/telegram";

interface TelegramAuthProps {
  searchParams: SearchParams;
  onCloseWindow: () => void;
  onLoadingChange: (v: boolean) => void;
  onError: (v: string) => void;
}

export default function TelegramAuthSDK({
  searchParams,
  onCloseWindow,
  onLoadingChange,
  onError,
}: TelegramAuthProps) {
  const changeLoading =
    useRef<TelegramAuthProps["onLoadingChange"]>(onLoadingChange);
  useEffect(() => {
    changeLoading.current = onLoadingChange;
  });

  const serviceURL = useMemo(() => {
    const { network, serviceURI } = searchParams;
    if (serviceURI && typeof serviceURI) return serviceURI;
    if (network && typeof network !== "string")
      throw onError("Invalid network");
    return network === "TESTNET" ? TESTNET_SERVICE_URL : MAINNET_SERVICE_URL;
  }, [onError, searchParams]);

  const authCallbackUrl = useMemo(() => {
    const { from } = searchParams;

    if (from && typeof from !== "string") throw onError("Invalid from");

    const redirect =
      TELEGRAM_REDIRECT_URI[
        (from ?? "default") as keyof typeof TELEGRAM_REDIRECT_URI
      ];

    return `${serviceURL}${redirect}`;
  }, [onError, searchParams, serviceURL]);

  const getTelegramAuth = useCallback(async () => {
    try {
      const { lang } = searchParams;
      if (lang && typeof lang !== "string") throw onError("Invalid lang");

      changeLoading.current(true);

      const result = await fetch(
        `${serviceURL}/api/app/telegramAuth/getTelegramBot`
      ).then((res) => res.json());

      const botName = result.botName;
      sessionStorage.setItem("TGURL", authCallbackUrl);
      changeLoading.current(false);
      if (!botName) throw onError("Invalid botName");
      telegramAuthAccessToken({
        botUsername: botName,
        authCallbackUrl: `${origin}/tg-auth-callback`,
      });
      changeLoading.current(false);

      window.removeEventListener("beforeunload", onCloseWindow);
    } catch (error) {
      changeLoading.current(false);
    }
  }, [authCallbackUrl, onCloseWindow, onError, searchParams, serviceURL]);

  useEffect(() => {
    getTelegramAuth();
  }, [getTelegramAuth]);

  return <div className="telegram-wrapper"></div>;
}
