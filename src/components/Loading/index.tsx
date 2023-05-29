import { useMemo } from "react";
import BaseLoading from "../BaseLoading";
import { OpacityType } from "src/types";
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
      <div className="loading-indicator bg-white w-[250px] p-5 rounded-lg">
        <BaseLoading className="w-11 h-11 m-auto" />
        <div className="loading-text">{loadingText}</div>
      </div>
    </div>
  ) : null;
}
