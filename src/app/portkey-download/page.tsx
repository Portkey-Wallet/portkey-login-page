"use client";
import { evokePortkey } from "@portkey/onboarding";
import { devices } from "@portkey/utils";
import queryString from "query-string";
import React, { useCallback, useEffect } from "react";
import Portkey from "../../assets/svg/Portkey.svg";
import Image from "next/image";
import BaseLoading from "src/components/BaseLoading";

export default function PortkeyDownload({
  searchParams,
}: {
  searchParams?: {
    evokeAppParams: any;
  };
}) {
  const download = useCallback(() => {
    const isMobile = devices.isMobile().phone;
    if (isMobile) {
      let option = searchParams?.evokeAppParams;
      if (!option) {
        option = {
          action: "open",
          custom: {},
        };
      } else {
        option = queryString.parse(option);
      }
      evokePortkey.app({
        ...option,
        onStatusChange: (status) => {
          switch (status) {
            case "success":
              window.close();
              break;
            case "failure":
            default:
              return;
          }
        },
      });
    } else {
      evokePortkey.extension().then((isDownload) => {
        if (isDownload) window.close();
        else window.close();
      });
    }
  }, [searchParams?.evokeAppParams]);

  useEffect(() => {
    download();
  }, [download]);
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Image src={Portkey} alt="Portkey logo" />
      <h1 className="text-[#25272A] text-[36px] leanding-[28px] font-medium text-center text-primary my-[16px] mt-[32px] ">
        Welcome to Portkey
      </h1>
      <div className="text-[#515A62] text-secondary text-[16px] leanding-[22px]">
        Your key to play and earn in Web 3
      </div>
      <div className="bg-[#F7F7F9] mt-[64px] rounded-[6px] py-[40px] w-[360px] text-center">
        <BaseLoading className="w-[44px] h-[44px] m-auto" />
        <div className="text-[18px] leanding-[22px]">
          Loading the download page...
        </div>
      </div>
    </div>
  );
}
