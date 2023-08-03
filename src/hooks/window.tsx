import { useCallback, useEffect, useMemo, useRef } from "react";
const useBeforeUnload = ({ errorType = "error" }: { errorType: string }) => {
  const errorTypeRef = useRef<string>(errorType);
  errorTypeRef.current = errorType;

  const onCloseWindow = useCallback(() => {
    window.opener.postMessage(
      {
        type: errorTypeRef.current,
        error: "user close the prompt",
      },
      "*"
    );
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", onCloseWindow);
    return () => {
      window.removeEventListener("beforeunload", onCloseWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuccess = useCallback(
    ({ type, data }: { type: string; data: any }) => {
      window.opener.postMessage(
        {
          type,
          data,
        },
        "*"
      );
      window.removeEventListener("beforeunload", onCloseWindow);
      window.close();
    },
    [onCloseWindow]
  );

  const removeListener = useCallback(
    () => window.removeEventListener("beforeunload", onCloseWindow),
    [onCloseWindow]
  );
  return useMemo(
    () => ({ onSuccess, removeListener }),
    [onSuccess, removeListener]
  );
};

export default useBeforeUnload;
