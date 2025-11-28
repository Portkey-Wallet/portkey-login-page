"use client"
import { useEffect, useMemo } from "react";
import { OpacityType } from "src/types";
import { PureLoadingIndicator } from "@portkey/did-ui-react";
import "./index.css";

export interface LoadingProps {
  loading?: boolean | OpacityType;
  loadingText?: string;
  cancelable?: boolean;
  className?: string;
  theme?: 'dark' | 'white';
}
export declare enum LoadingColor {
  WHITE = "white",
  DARK = "dark"
}
export default function Loading({
  loading,
  loadingText = "Loading...",
  className,
  theme = 'white'
}: LoadingProps) {
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  })
  const style = useMemo(
    () =>
      typeof loading !== "number"
        ? undefined
        : {
            backgroundColor: `rgb(00 00 00 / ${loading * 100}%)`,
          },
    [loading]
  );

  const loadingTheme = useMemo(
    () =>
      theme === "dark"
        ? 'white'
        : 'dark',
    [theme]
  );

  return loading ? (
    <div
      className={
        "loading-wrapper max-h-screen fixed w-screen h-screen flex justify-center items-center z-999 text-center flex-col gap-6 " +
        (className || "")
      }
      style={style}>
      <PureLoadingIndicator width={32} height={32}  color={loadingTheme as LoadingColor || 'dark'} />
      <div className="loading-text">{loadingText}</div>
    </div>
  ) : null;
}
