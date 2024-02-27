"use client";
import React, { useEffect, useMemo } from "react";
import GoogleReCaptcha from "src/components/GoogleReCaptcha";
import { BaseReCaptcha } from "src/components/GoogleReCaptcha/types";
import { TSearch } from "src/types";
import "./index.css";
import queryString from "query-string";

interface UnityReCaptcha extends BaseReCaptcha
{
  port?: string;
}

export default function Recaptcha({
  searchParams = {},
}: {
  searchParams: TSearch;
}) {
  const {
    theme = "light",
    siteKey,
    port,
    size = "normal",
  } = useMemo(() => {
    return searchParams as Omit<UnityReCaptcha, "customReCaptchaHandler">;
  }, [searchParams]);

  useEffect(() => {
    document.body.classList.add("recaptcha-body");
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      {siteKey ? (
        <GoogleReCaptcha
          theme={theme || "light"}
          size={size || "normal"}
          siteKey={siteKey}
          onSuccess={(res) => {
            window.open(`http://localhost:${port}?${queryString.stringify({
              res,
            })}`)
          }}
          onError={(err) => {
            console.log(err, "onError");
            window.open(`http://localhost:${port}?${queryString.stringify({
              err,
            })}`)
          }}
          onExpire={(err) => {
            console.log(err, "onExpire");
            window.open(`http://localhost:${port}?${queryString.stringify({
              err,
            })}`)
          }}
        />
      ) : (
        "Invalid siteKey"
      )}
    </div>
  );
}
