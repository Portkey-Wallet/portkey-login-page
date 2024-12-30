"use client"
import { useMemo } from "react";
import { OpacityType } from "src/types";
import { PureLoadingIndicator } from "@portkey/did-ui-react";
import "./index.css";

export interface LoadingProps {
  loading?: boolean | OpacityType;
  loadingText?: string;
  cancelable?: boolean;
  className?: string;
}

export default function Loading({
  loading,
  loadingText = "Loading...",
  className,
}: LoadingProps) {
  const style = useMemo(
    () =>
      typeof loading !== "number"
        ? undefined
        : {
            backgroundColor: `rgb(00 00 00 / ${loading * 100}%)`,
          },
    [loading]
  );

  return loading ? (
    <div
      className={
        "loading-wrapper max-h-screen fixed w-screen h-screen flex justify-center items-center z-999 text-center " +
        (className || "")
      }
      style={style}>
      <PureLoadingIndicator width={44} height={44}/>
    </div>
  ) : null;
}
