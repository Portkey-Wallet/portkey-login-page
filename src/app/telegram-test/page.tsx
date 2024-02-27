"use client";

import { useEffect } from "react";
import { telegramAuthAccessToken } from "src/utils/telegram";

export default function TelegramTest() {
  useEffect(() => {
    telegramAuthAccessToken({
      botUsername: "sTestABot",
      authCallbackUrl:
        "https://openlogin-test.portkey.finance/tg-auth-callback",
    });
  }, []);
  return null;
}
