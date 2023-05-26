"use client";
import React, { useCallback, useEffect } from "react";
import GoogleReCaptcha from "src/components/GoogleReCaptcha";
import Loading from "src/components/Loading";
import {
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
  GG_CLIENT_ID,
} from "src/constants";
import { SearchParams } from "src/types";
import { appleAuthIdToken } from "src/utils/AppleAuth";
import { getGoogleAccessToken } from "src/utils/GoogleAuthReplace";

export default function SocialLogin({
  params,
  searchParams,
}: {
  params: { authType: string };
  searchParams: SearchParams;
}) {
  const [loading, setLoading] = React.useState(false);
  const [errorInfo, setError] = React.useState<string | null>(null);

  const onCloseWindow = useCallback(() => {
    window.opener.postMessage(
      {
        type: "PortkeySocialLoginOnFailure",
        error: "User close the prompt",
      },
      "*"
    );
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", onCloseWindow);
    return () => {
      window.removeEventListener("beforeunload", onCloseWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSearchParams = useCallback(() => {
    if (!searchParams || !Object.keys(searchParams).length)
      return { clientId: undefined, redirectURI: undefined };
    const { clientId, redirectURI } = searchParams;
    if (typeof clientId !== "string") throw setError("Invalid clientId");
    if (typeof redirectURI !== "string") throw setError("Invalid redirectURI");
    return { clientId, redirectURI };
  }, [searchParams]);

  const getGoogleAuth = useCallback(async () => {
    const { clientId, redirectURI } = checkSearchParams();
    const _clientId = clientId || GG_CLIENT_ID;
    const _redirectURI = redirectURI || `${location.origin}/auth-callback`;
    setLoading(true);
    window.removeEventListener("beforeunload", onCloseWindow);

    getGoogleAccessToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
    });
  }, [checkSearchParams, onCloseWindow]);

  const getAppleAuth = useCallback(async () => {
    const { clientId, redirectURI } = checkSearchParams();
    const _clientId = clientId || APPLE_CLIENT_ID;
    const _redirectURI = redirectURI || APPLE_REDIRECT_URI;
    setLoading(true);
    window.removeEventListener("beforeunload", onCloseWindow);

    await appleAuthIdToken({
      clientId: _clientId,
      redirectURI: _redirectURI,
    });
  }, [checkSearchParams, onCloseWindow]);

  const onSuccess = useCallback(
    (res: string) => {
      const { authType } = params;
      switch (authType) {
        case "Google":
          getGoogleAuth();
          break;
        case "Apple":
          getAppleAuth();
          break;
        default:
          setError("Invalid authType");
          throw "Invalid authType";
      }
    },
    [getAppleAuth, getGoogleAuth, params]
  );

  return (
    <div className="h-screen flex justify-center items-center">
      {errorInfo ? (
        errorInfo
      ) : (
        <div className="">
          <GoogleReCaptcha
            siteKey={"6LdxCCsmAAAAACHL0Id7iOkUnOM0P_oQqsVc0Ogy"}
            onSuccess={onSuccess}
          />
        </div>
      )}
      <Loading loading={loading} />
    </div>
  );
}
