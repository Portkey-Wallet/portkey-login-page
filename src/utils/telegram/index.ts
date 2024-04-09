import { createScript } from "./createScript";
import { CreateScriptOptions } from "./types";

export const telegramAuthAccessToken = async (
  params: Omit<CreateScriptOptions, "onAuthCallback">
) => {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const scriptNode = createScript({ ...params });

  const onLoad = (e: any) => {
    console.log(e, "scriptNode");
    scriptNode.removeEventListener("load", onLoad);
  };
  scriptNode.addEventListener("load", onLoad);

  document.body.appendChild(scriptNode);
};

const TELEGRAM_API_SRC = "https://telegram.org/js/telegram-web-app.js";
const TELEGRAM_API_SCRIPT_ID = "telegram-web-app";
const insertScript = async (
  d: Document,
  s = "script",
  id: string,
  jsSrc: string
) =>
  new Promise((resolve, reject) => {
    try {
      const telegramScriptTag: any = d.createElement(s);
      telegramScriptTag.id = id;
      telegramScriptTag.src = jsSrc;
      telegramScriptTag.async = true;
      telegramScriptTag.defer = true;
      const scriptNode = document.getElementsByTagName("script")?.[0];
      if (!scriptNode) {
        document.getElementsByTagName("body")[0].appendChild(telegramScriptTag);
      } else {
        scriptNode &&
          scriptNode.parentNode &&
          scriptNode.parentNode.insertBefore(telegramScriptTag, scriptNode);
      }
      telegramScriptTag.onload = resolve;
    } catch (error) {
      reject(error);
    }
  });

export const loadTelegramSdk = async () => {
  if (!(window as any)?.Telegram) {
    await insertScript(
      document,
      "script",
      TELEGRAM_API_SCRIPT_ID,
      TELEGRAM_API_SRC
    );
  }
};
