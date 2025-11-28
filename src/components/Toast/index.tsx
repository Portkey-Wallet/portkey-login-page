"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { eventBus } from "src/utils";
import { TOAST_EVENT, TToastProps } from "./ToastShow";
import "./index.css";

export default function Toast() {
  const [toastInfo, setToastInfo] = useState<TToastProps | undefined>();

  const timerRef = useRef<number>();

  useEffect(() => {
    const eventHandler = (props: TToastProps) => {
      clearTimeout(timerRef.current);

      setToastInfo(props);
    };
    eventBus.addListener(TOAST_EVENT, eventHandler);
    return () => {
      eventBus.removeListener(TOAST_EVENT, eventHandler);
    };
  }, []);

  useEffect(() => {
    if (toastInfo) {
      timerRef.current = Number(
        setTimeout(() => {
          clearTimeout(timerRef.current);
          setToastInfo(undefined);
        }, toastInfo.timeout || 3000)
      );
    }
  }, [toastInfo]);

  return (
    <div
      className={clsx(
        "openlogin-toast",
        toastInfo ? "openlogin-toast-show" : ""
      )}>
      <div className="openlogin-toast-content">{toastInfo?.message}</div>
    </div>
  );
}
