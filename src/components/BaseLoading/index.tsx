"use client";
import { useRef, useEffect } from "react";
import lottie, { AnimationItem } from "lottie-web";
import animationData from "./data";
import clsx from "clsx";

const LoadingIndicator = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!animation.current) {
      animation.current = lottie.loadAnimation({
        container: containerRef.current!,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    }
    return () => {
      if (animation.current) {
        animation.current.stop();
        animation.current.destroy();
        animation.current = null;
      }
    };
  }, []);

  return <div className={clsx("loading", className)} ref={containerRef}></div>;
};

export default LoadingIndicator;
