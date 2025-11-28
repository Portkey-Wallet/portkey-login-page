import EventEmitter from "events";

export function base64toJSON<T = Record<string, unknown>>(b64str: string): T {
  const jsonStr = Buffer.from(b64str, "base64").toString();
  return JSON.parse(jsonStr);
}

export const eventBus = new EventEmitter();
