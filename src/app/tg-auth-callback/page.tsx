"use client";

import React, { useEffect } from "react";
import Loading from "src/components/Loading";

export default function TGAuth() {
  useEffect(() => {
    if (location.search) {
      const url = sessionStorage.getItem("TGURL");
      if (url) location.href = `${url}${location.search}`;
    }
  }, []);
  return <Loading loading={true} />;
}
