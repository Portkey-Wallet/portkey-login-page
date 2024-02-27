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

export default function TelegramAuth({
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

  // useEffect(() => {
  //   const handler = async (event: any) => {
  //     const detail = JSON.parse(event.detail);

  //     switch (detail.event) {
  //       case TGStauts.unauthorized:
  //         changeLoading.current(false);

  //         break;
  //       case TGStauts.auth_user:
  //         location.href = `${authCallbackUrl}?${stringify(detail.auth_data)}`;
  //         break;
  //     }
  //   };

  //   window.addEventListener("TG-SEND", handler);
  //   return () => {
  //     window.removeEventListener("TG-SEND", handler);
  //   };
  // }, [authCallbackUrl]);

  // const tgAuth = useCallback(async (botId: string) => {
  //   const TWidgetLogin = (window as any)?.TWidgetLogin;
  //   if (!TWidgetLogin) throw "";
  //   TWidgetLogin.init(
  //     "widget_login",
  //     botId,
  //     { origin: "https://core.telegram.org" },
  //     false,
  //     "en"
  //   );

  //   TWidgetLogin.auth();
  // }, []);

  const getTelegramAuth = useCallback(async () => {
    try {
      const { lang } = searchParams;
      if (lang && typeof lang !== "string") throw onError("Invalid lang");

      changeLoading.current(true);

      const result = await fetch(
        `${serviceURL}/api/app/telegramAuth/getTelegramBot`
      ).then((res) => res.json());

      // const botId = result.botId;
      const botName = result.botName;
      sessionStorage.setItem("TGURL", authCallbackUrl);
      changeLoading.current(false);

      // TODO
      telegramAuthAccessToken({
        botUsername: botName,
        authCallbackUrl:
          "https://openlogin-test.portkey.finance/tg-auth-callback",
      });
      // if (!botId) throw onError("Invalid botName");
      // changeLoading.current(false);

      window.removeEventListener("beforeunload", onCloseWindow);

      // await tgAuth(botId);
    } catch (error) {
      changeLoading.current(false);
    }
  }, [authCallbackUrl, onCloseWindow, onError, searchParams, serviceURL]);

  useEffect(() => {
    getTelegramAuth();
  }, [getTelegramAuth]);

  return (
    <div className="telegram-wrapper">
      {/* <link
        rel="stylesheet"
        href="https://telegram.org/css/widget-frame.css?66"
        data-precedence="next"
      />

      <div className="tgme_widget_login nouserpic large" id="widget_login">
        <button
          id="login-btn"
          className="btn tgme_widget_login_button"
          onClick={() => {
            if (typeof window === "undefined") return;
            changeLoading.current(true);

            const TWidgetLogin = (window as any).TWidgetLogin;
            TWidgetLogin.auth();
          }}>
          <i className="tgme_widget_login_button_icon"></i>log in with telegram
        </button>
      </div>

      <Script src="/widget-frame.js" onLoad={async () => {}}></Script> */}
    </div>
  );
}
