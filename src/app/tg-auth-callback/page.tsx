"use client";

import React, { useEffect } from "react";

export default function TGAuth() {
  useEffect(() => {
    if (location.search) {
      const url = sessionStorage.getItem("TGURL");
      if (url) location.href = `${url}?${location.search}`;
    }
  }, []);
  return (
    <div
      onClick={() => {
        window.open("/telegram-test");
      }}>
      page
    </div>
  );
}
