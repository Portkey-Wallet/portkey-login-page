export const APPLE_CLIENT_ID = "com.portkey.did.extension.service";

export const APPLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_APP_APPLE_REDIRECT_URI;

export const APPLE_REDIRECT_URI_V2 =
  process.env.NEXT_PUBLIC_APP_APPLE_REDIRECT_URI_V2;

export const GG_CLIENT_ID =
  "176147744733-a2ks681uuqrmb8ajqrpu17te42gst6lq.apps.googleusercontent.com";
// export const GG_REDIRECT_URI = `${location.origin}/auth-callback`;

export const APPLE_OPEN_LOGIN_REDIRECT_URI = "/api/app/appleAuth/unifyReceive";

export const TELEGRAM_PORTKEY_REDIRECT_URI =
  "/api/app/telegramAuth/receive/portkey";
export const TELEGRAM_OPEN_LOGIN_REDIRECT_URI =
  "/api/app/telegramAuth/receive/openlogin";
export const TELEGRAM_UNITY_SDK_REDIRECT_URI =
  "/api/app/telegramAuth/receive/unitysdk";
export const MAINNET_SERVICE_URL = process.env.NEXT_PUBLIC_APP_MAINNET_SERVICE;
export const TESTNET_SERVICE_URL = process.env.NEXT_PUBLIC_APP_TESTNET_SERVICE;
export const MAINNET_GRAPHQL_URL = process.env.NEXT_PUBLIC_APP_MAINNET_GRAPHQL;
export const TESTNET_GRAPHQL_URL = process.env.NEXT_PUBLIC_APP_TESTNET_GRAPHQL;
export const MAINNET_CONNECT_URL = process.env.NEXT_PUBLIC_APP_MAINNET_CONNECT;
export const TESTNET_CONNECT_URL = process.env.NEXT_PUBLIC_APP_TESTNET_CONNECT;

export enum UrlType {
  SERVICE = "SERVICE",
  CONNECT = "CONNECT",
  GRAPHQL = "GRAPHQL",
}

export const PortkeyServiceUrl = {
  MAINNET: {
    [UrlType.SERVICE]: MAINNET_SERVICE_URL,
    [UrlType.CONNECT]: MAINNET_CONNECT_URL,
    [UrlType.GRAPHQL]: TESTNET_GRAPHQL_URL,
  },
  TESTNET: {
    [UrlType.SERVICE]: TESTNET_SERVICE_URL,
    [UrlType.CONNECT]: TESTNET_CONNECT_URL,
    [UrlType.GRAPHQL]: MAINNET_GRAPHQL_URL,
  },
};

export const TELEGRAM_REDIRECT_URI = {
  portkey: TELEGRAM_PORTKEY_REDIRECT_URI,
  openlogin: TELEGRAM_OPEN_LOGIN_REDIRECT_URI,
  unitysdk: TELEGRAM_UNITY_SDK_REDIRECT_URI,
  default: TELEGRAM_OPEN_LOGIN_REDIRECT_URI,
} as const;

export const PORTKEY_VERSION = "v2";

/** TWITTER  oauth2 */
export const TWITTER_CLIENT_ID = "VE5DRUl1bHdoeHN0cW9POEpEYlY6MTpjaQ";

export const TWITTER_PORTKEY_REDIRECT_URI = "/api/app/twitterAuth/receive";

/** TWITTER  oauth1 */
export const TWITTER_OPEN_LOGIN_REDIRECT_URI = "/api/app/twitterAuth/callback";

export const FACEBOOK_REDIRECT_URI = "1061123428463627";

export const FACEBOOK_OPEN_LOGIN_REDIRECT_URI =
  "/api/app/facebookAuth/unifyReceive";
