"use client";
import React, { useCallback, useEffect } from "react";
import qs from "query-string";
import { getPortkeyServiceUrl } from "src/utils/common";
import { NetworkType } from "@portkey/did-ui-react";
import {
  CrossTabPushMessageType,
  pushMessageByApi,
} from "src/utils/crossTabMessagePush";

export default function ThirdPartBridge() {
  const handler = useCallback(async () => {
    const params = qs.parse(window.location.search) as any;

    // jump to the ach-buy page
    if (params.portkeyMethod === "TO_ACH_BUY") {
      let achUrl = `${params?.url}/?crypto=${params?.crypto}&network=${
        params?.network
      }&country=${params?.country}&fiat=${params?.fiat}&appId=${
        params?.appId
      }&callbackUrl=${encodeURIComponent(
        params?.callbackUrl
      )}&merchantOrderNo=${params?.merchantOrderNo}&type=buy&fiatAmount=${
        params?.fiatAmount
      }&address=${params?.address}&sign=${encodeURIComponent(params?.sign)}`;

      if (params?.token !== undefined) {
        achUrl += `&token=${encodeURIComponent(params.token)}`;
      }

      window.open(achUrl, "_self");
    }

    // jump to the ach-sell page
    if (params.portkeyMethod === "TO_ACH_SELL") {
      let achUrl = `${params?.url}/?crypto=${params?.crypto}&network=${
        params?.network
      }&country=${params?.country}&fiat=${params?.fiat}&appId=${
        params?.appId
      }&callbackUrl=${encodeURIComponent(
        params?.callbackUrl
      )}&merchantOrderNo=${params?.merchantOrderNo}&type=sell&cryptoAmount=${
        params?.cryptoAmount
      }&withdrawUrl=${encodeURIComponent(
        params.withdrawUrl
      )}&source=3#/sell-formUserInfo`;

      window.open(achUrl, "_self");
    }

    // redirect back from ach-buy page
    if (params.portkeyMethod === "ACH_BUY_BACK") {
      // close the page directly without other operations
      window.close();
    }

    // redirect back from ach-sell page
    if (params.portkeyMethod === "ACH_SELL_BACK") {
      if (params.v) {
        await pushMessageByApi({
          methodName: CrossTabPushMessageType.onCheckSellResult,
          params: {
            serviceURI:
              getPortkeyServiceUrl({
                networkType: params.networkType as NetworkType,
              }) || "",
            loginId: params.clientId,
            data: JSON.stringify(params),
          },
        });
      } else {
        // notify the parent window to query the sell result
        window.opener.postMessage(
          {
            type: "CHECK_SELL_RESULT",
            data: params,
          },
          "*"
        );
      }
      window.close();
    }
  }, []);

  useEffect(() => {
    handler();
  }, [handler]);

  return <div className="h-screen flex justify-center items-center"></div>;
}
