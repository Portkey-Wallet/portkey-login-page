import { useEffect, useState } from 'react';

const MOBILE_DEFAULT_WIDTH = 500;

export const useStyleProvider = <T>(props: { pcStyle: T; mobileStyle: T; checker?: () => boolean }): T => {
  const { pcStyle, mobileStyle, checker = defaultMobileChecker } = props;
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    if (!pcStyle || !mobileStyle) throw new Error('invalid style object.');
    setIsMobile(checker());
  }, [checker, mobileStyle, pcStyle]);
  return isMobile ? mobileStyle : pcStyle;
};

export const defaultMobileChecker = (): boolean => {
  const width = getCurrentWidth();
  return width <= MOBILE_DEFAULT_WIDTH;
};

export const getCurrentWidth = () => {
  return window.screen.width ?? window.outerWidth ?? window.innerWidth ?? MOBILE_DEFAULT_WIDTH;
};
