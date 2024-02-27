"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { base64toJSON } from "src/utils";
import { OPENLOGIN_ACTIONS } from "src/constants/social";
import SocialAuth from "src/pages-components/social-auth";
import { OpenloginParamConfig } from "src/types/auth";

export default function SocialStart() {
  const searchParams = useSearchParams();
  const b64Params = searchParams.get("b64Params") || "";

  const params = useMemo(() => {
    try {
      const data = base64toJSON(b64Params);
      console.log(data, "b64Params===");
      return data as any;
    } catch (error) {
      return {};
    }
  }, [b64Params]);
  return (
    <div>
      {params?.actionType === OPENLOGIN_ACTIONS.LOGIN ? (
        <SocialAuth authInfo={params as OpenloginParamConfig} />
      ) : (
        <>`actionType` No Support</>
      )}
    </div>
  );
}
