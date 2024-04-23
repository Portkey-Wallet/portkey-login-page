"use client";
import { useCallback, useRef } from "react";
import { useEffectOnce } from "react-use";
import "@portkey/did-ui-react/dist/assets/index.css";
import {
  getAccessTokenAndOpenDappWebapp,
  getTelegramStartParam,
  handleErrorMessage,
  singleMessage,
} from "@portkey/did-ui-react";
import { TelegramWebappInitData } from "@portkey/types";
import { loadTelegramSdk } from "src/utils/telegram";
import Loading from "src/components/Loading";
import qs from "query-string";

export default function PortkeyWebapp() {
  const timerRef = useRef<NodeJS.Timer>();

  const TelegramRef = useRef<any>();

  const handleTGAuth = useCallback(
    async (telegramInitData?: TelegramWebappInitData) => {
      if (
        !telegramInitData?.user ||
        !telegramInitData?.auth_date ||
        !telegramInitData?.hash
      ) {
        throw Error("No telegram init data");
      }

      try {
        const { startParam } = getTelegramStartParam();
        if (!startParam) throw Error("No loginId");

        await getAccessTokenAndOpenDappWebapp({
          loginId: startParam,
          telegramUserInfo: telegramInitData,
        });
      } catch (error) {
        throw Error(handleErrorMessage(error));
      }
    },
    []
  );

  const getTelegram = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        TelegramRef.current = (window as any)?.Telegram;
        if (!TelegramRef.current) {
          await loadTelegramSdk();
        }

        clearInterval(timerRef.current);
        timerRef.current = undefined;

        TelegramRef.current.WebApp.ready();
        console.log("TelegramRef.current", TelegramRef.current);

        const initDataString = TelegramRef.current.WebApp.initData;
        const initData = qs.parse(
          initDataString
        ) as unknown as TelegramWebappInitData;
        await handleTGAuth(initData);
      }
    } catch (error) {
      singleMessage.error(
        "Failed to retrieve user information. Please refresh and try again."
      );
      throw new Error(handleErrorMessage(error));
    }
  }, [handleTGAuth]);

  useEffectOnce(() => {
    timerRef.current = setInterval(() => {
      getTelegram();
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    };
  });

  return (
    <>
      <Loading loading loadingText="Logging..." />
    </>
  );
}
