"use client";

import React from "react";
import { telegramAuthAccessToken } from "src/utils/telegram";

export default function TelegramTest() {
  return (
    <div
      style={{ color: "red" }}
      onClick={() => {
        telegramAuthAccessToken({
          botUsername: "sTestABot",
          authCallbackUrl:
            "https://openlogin-test.portkey.finance/tg-auth-callback",
        });
      }}>
      TelegramTest
    </div>
  );
}
