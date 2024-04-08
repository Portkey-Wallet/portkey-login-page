"use client";
import Portkey from "../../../assets/svg/Portkey.svg";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useEffectOnce } from "react-use";
import "@portkey/did-ui-react/dist/assets/index.css";
import { NetworkType, TelegramLoginButton } from "@portkey/did-ui-react";
import "./index.css";
import { useSearchParams } from "next/navigation";

export default function PortkeyWebapp() {
  const searchParams = useSearchParams();
  const networkType = useRef(searchParams.get("networkType") as NetworkType);
  const timerRef = useRef<NodeJS.Timer>();

  const TelegramRef = useRef<any>();
  const [showTelegramLoginButton, setShowTelegramLoginButton] =
    useState<boolean>(true);

  const getTelegram = useCallback(async () => {
    if (typeof window !== "undefined") {
      TelegramRef.current = (window as any)?.Telegram;
      if (!TelegramRef.current) return;

      clearInterval(timerRef.current);
      timerRef.current = undefined;

      TelegramRef.current.WebApp.ready();
      console.log("TelegramRef.current", TelegramRef.current);
      setShowTelegramLoginButton(true);
    }
  }, []);

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
    <div className="portkey-telegram-webapp">
      <div className="portkey-telegram-webapp-logo">
        <Image src={Portkey} alt="Portkey logo" />
        {networkType.current !== "MAINNET" && (
          <span className="portkey-network-type">TEST</span>
        )}
      </div>
      {showTelegramLoginButton && <TelegramLoginButton />}
    </div>
  );
}
