"use client";
import Portkey from "../../../assets/svg/Portkey.svg";
import Image from "next/image";
import { sleep } from "@portkey/utils";
import { useCallback, useRef, useState } from "react";
import { useEffectOnce } from "react-use";
import "@portkey/did-ui-react/dist/assets/index.css";
import { TelegramLoginButton } from "@portkey/did-ui-react";
import "./index.css";

export default function PortkeyWebapp() {
  const TelegramRef = useRef<any>();
  const [showTelegramLoginButton, setShowTelegramLoginButton] =
    useState<boolean>(true);

  const getTelegram = useCallback(async () => {
    if (typeof window !== "undefined") {
      await sleep(1000);

      TelegramRef.current = (window as any)?.Telegram;
      if (!TelegramRef.current) return;

      TelegramRef.current.WebApp.ready();
      console.log("TelegramRef.current", TelegramRef.current);
      setShowTelegramLoginButton(true);
    }
  }, []);

  useEffectOnce(() => {
    getTelegram();
  });

  return (
    <div className="portkey-telegram-webapp">
      <Image src={Portkey} alt="Portkey logo" />
      {showTelegramLoginButton && <TelegramLoginButton />}
    </div>
  );
}
