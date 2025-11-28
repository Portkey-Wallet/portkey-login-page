import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TELEGRAM_REDIRECT_URI } from "src/constants";
import { OpenLoginParamConfig } from "src/types/auth";
import { telegramAuthAccessToken } from "src/utils/telegram";
import "./index.css";

interface TelegramAuthProps {
  authInfo: OpenLoginParamConfig;
  onLoadingChange: (v: boolean) => void;
  onError: (v: string) => void;
}

export default function TelegramAuthUpgraded({
  authInfo,
  onLoadingChange,
  onError,
}: TelegramAuthProps) {
  const changeLoading =
    useRef<TelegramAuthProps["onLoadingChange"]>(onLoadingChange);
  useEffect(() => {
    changeLoading.current = onLoadingChange;
  });

  const authCallbackUrl = useMemo(() => {
    const { from, serviceURI } = authInfo;
    const redirect =
      TELEGRAM_REDIRECT_URI[
        (from ?? "default") as keyof typeof TELEGRAM_REDIRECT_URI
      ];

    return `${serviceURI}${redirect}`;
  }, [authInfo]);

  const getTelegramAuth = useCallback(async () => {
    try {
      const { serviceURI } = authInfo;

      changeLoading.current(true);

      const fetchRes = await fetch(
        `${serviceURI}/api/app/telegramAuth/getTelegramBot`
      );

      const result = await fetchRes.json();
      document.body.classList.add("telegram-sdk-auth-body");

      const botName = result.botName;
      sessionStorage.setItem("TGURL", authCallbackUrl);

      if (!botName) throw onError("Invalid telegram bot");
      changeLoading.current(false);

      history.pushState({ path: location.pathname }, "", location.pathname);

      telegramAuthAccessToken({
        botUsername: botName,
        authCallbackUrl: `${origin}/tg-auth-callback`,
      });
    } catch (error) {
      changeLoading.current(false);
      console.log(error);
    }
  }, [authCallbackUrl, authInfo, onError]);

  useEffect(() => {
    getTelegramAuth();
  }, [getTelegramAuth]);

  return <div className="telegram-auth-sdk-wrapper"></div>;
}
