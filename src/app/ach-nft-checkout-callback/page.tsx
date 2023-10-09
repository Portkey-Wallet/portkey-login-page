"use client";

import React, { useCallback, useEffect, useState } from "react";
import qs from "query-string";
import { sleep } from "@portkey/utils";
import BaseLoading from "src/components/BaseLoading";

export default function NFTCheckoutCallback() {
  const [error, setError] = useState<string>();

  const onSuccess = useCallback(() => {
    const params = qs.parse(window.location.search) as any;

    window.parent.postMessage(
      {
        type: "PortkeyAchNFTCheckoutOnSuccess",
        data: params,
        target: "@portkey/ui-did-react:ACH_NFT_CHECKOUT",
      },
      "*"
    );
  }, []);

  useEffect(() => {
    sleep(1000)
      .then(onSuccess)
      .catch((error) => {
        setError(JSON.stringify(error));
      });
  }, [onSuccess]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {error ? (
        <div>{error}</div>
      ) : (
        <div>
          <BaseLoading className="w-[80px] h-[80px] m-auto" />
        </div>
      )}
    </div>
  );
}
