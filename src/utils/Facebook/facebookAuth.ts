import { insertScript } from "../insertScript";

const SDK_URL: string = "https://connect.facebook.net/en_EN/sdk.js";
const SCRIPT_ID: string = "facebook-jssdk";

const noWinError = "window is undefined";
const noFBError = "Facebook sdk load error";

interface FBInitParams {
  appId: string;
  xfbml?: boolean;
  version?: string;
  state?: boolean;
  cookie?: boolean;
  redirectURI?: string;
  responseType?: string;
}

interface FBLoginParams {
  scope?: string;
  authType?: string;
  returnScopes?: boolean;
}

interface FBAuthProps extends FBInitParams, FBLoginParams {
  language?: string;
  isDisabled?: boolean;
  isOnlyGetToken?: boolean;
  fieldsProfile?: string;
}

const checkIsExistsSDKScript = () => {
  return !!document.getElementById(SCRIPT_ID);
};

const loadFBSdk = async () => {
  if (checkIsExistsSDKScript()) {
    return window?.FB;
  }
  await insertScript(document, "script", SCRIPT_ID, SDK_URL);
  if (!window.FB) throw Error(noFBError);

  return window.FB;
};

const FBinit = async (config: FBInitParams) => {
  console.log(config, "config===");
  const { redirectURI, responseType, version = "v19.0", ...params } = config;

  const initParams = {
    ...params,
    version,
    redirect_uri: redirectURI,
    response_type: responseType,
  };

  return new Promise<any>((resolve) => {
    if ((window as any).fbAsyncInit) {
      window.FB.init(initParams);
      resolve(true);
      return;
    }
    (window as any).fbAsyncInit = async () => {
      await (window as any).FB.init(initParams);
      resolve(true);
    };
  });
};

const onLogin = (params: FBLoginParams) => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus((response: any) => {
      if (response.authResponse) {
        resolve(response);
      } else {
        window.FB.login(function (response: any) {
          console.log(response, "response==");
          if (response.authResponse) return resolve(response);
          reject("User cancelled login or did not fully authorize.");
        }, params);
      }
    });
  });
};

export const facebookAuth = async ({
  scope,
  returnScopes,
  authType,
  ...props
}: FBAuthProps) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (typeof window === "undefined") throw new Error(noWinError);
      await loadFBSdk();

      await FBinit(props);

      const result = await onLogin({
        scope,
        returnScopes,
        authType,
      });

      resolve(result);
    } catch (err) {
      reject?.(err);
    }
  });
};
