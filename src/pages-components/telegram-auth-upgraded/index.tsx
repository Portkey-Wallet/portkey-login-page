import Script from "next/script";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TELEGRAM_REDIRECT_URI } from "src/constants";
import { stringify } from "query-string";
import { OpenloginParamConfig } from "src/types/auth";
import { Toast } from "src/components/Toast/ToastShow";
import "./index.css";

enum TGStauts {
  unauthorized = "unauthorized",
  auth_user = "auth_user",
}

interface TelegramAuthProps {
  authInfo: OpenloginParamConfig;
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

  useEffect(() => {
    const handler = async (event: any) => {
      const detail = JSON.parse(event.detail);
      console.log(event, "detail");
      switch (detail.event) {
        case TGStauts.unauthorized:
          changeLoading.current(false);
          Toast.show("unauthorized");
          break;
        case TGStauts.auth_user:
          location.href = `${authCallbackUrl}?${stringify(detail.auth_data)}`;
          break;
      }
    };

    window.addEventListener("TG-SEND", handler);
    return () => {
      window.removeEventListener("TG-SEND", handler);
    };
  }, [authCallbackUrl, onError]);

  const tgAuth = useCallback(async (botId: string) => {
    const TWidgetLogin = (window as any)?.TWidgetLogin;
    if (!TWidgetLogin) throw "";
    TWidgetLogin.init(
      "widget_login",
      botId,
      { origin: "https://core.telegram.org" },
      false,
      "en"
    );

    TWidgetLogin.auth();
  }, []);

  const getTelegramAuth = useCallback(async () => {
    try {
      const { serviceURI } = authInfo;

      changeLoading.current(true);

      const fetchRes = await fetch(
        `${serviceURI}/api/app/telegramAuth/getTelegramBot`
      );

      const result = await fetchRes.json();
      const botId = result.botId;
      console.log(botId, result, "botId==");
      if (!botId) throw onError("Invalid telegram bot");
      changeLoading.current(false);

      await tgAuth(botId);
    } catch (error) {
      changeLoading.current(false);
      console.log(error);
    }
  }, [authInfo, onError, tgAuth]);

  useEffect(() => {
    getTelegramAuth();
  }, [getTelegramAuth]);

  return (
    <div className="telegram-wrapper">
      <link
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

      <Script src="/widget-frame.js" onLoad={async () => {}}></Script>
    </div>
  );
}
