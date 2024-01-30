export const APPLE_CLIENT_ID = "com.portkey.did.extension.service";

export const APPLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_APP_APPLE_REDIRECT_URI;

export const APPLE_REDIRECT_URI_V2 =
  process.env.NEXT_PUBLIC_APP_APPLE_REDIRECT_URI_V2;

export const GG_CLIENT_ID =
  "176147744733-a2ks681uuqrmb8ajqrpu17te42gst6lq.apps.googleusercontent.com";
// export const GG_REDIRECT_URI = `${location.origin}/auth-callback`;

export const TELEGRAM_PORTKEY_REDIRECT_URI =
  "/api/app/telegramAuth/receive/portkey";
export const TELEGRAM_OPEN_LOGIN_REDIRECT_URI =
  "/api/app/telegramAuth/receive/openlogin";
export const MAINNET_SERVICE_URL = process.env.NEXT_PUBLIC_APP_MAINNET_SERVICE;
export const TESTNET_SERVICE_URL = process.env.NEXT_PUBLIC_APP_TESTNET_SERVICE;

export const TELEGRAM_REDIRECT_URI = {
  portkey: TELEGRAM_PORTKEY_REDIRECT_URI,
  openlogin: TELEGRAM_OPEN_LOGIN_REDIRECT_URI,
  default: TELEGRAM_OPEN_LOGIN_REDIRECT_URI,
} as const;

export const PORTKEY_VERSION = "v2";

/** TWITTER  */
export const TWITTER_CLIENT_ID = "VE5DRUl1bHdoeHN0cW9POEpEYlY6MTpjaQ";

export const TWITTER_LOGIN_REDIRECT_URI =
  "/api/app/telegramAuth/receive/openlogin";

export const TWITTER_PORTKEY_REDIRECT_URI = "/api/app/twitterAuth/receive";
export const TWITTER_OPEN_LOGIN_REDIRECT_URI =
  "/api/app/twitterAuth/unifyReceive";

export const FACEBOOK_REDIRECT_URI = "1061123428463627";
