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
