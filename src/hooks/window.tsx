import { useCallback, useEffect, useMemo, useRef } from "react";
const useBeforeUnload = ({ errorType = "error" }: { errorType: string }) => {
  const errorTypeRef = useRef<string>(errorType);
  errorTypeRef.current = errorType;

  const onCloseWindow = useCallback(() => {
    if (!window.opener) return;
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

  const onFinish = useCallback(
    ({ type, data, error }: { type: string; data?: any; error?: any }) => {
      if (!window.opener) return;
      window.opener.postMessage(
        {
          type,
          data,
          error,
        },
        "*"
      );
      window.removeEventListener("beforeunload", onCloseWindow);
      window.close();
    },
    [onCloseWindow]
  );

  const onPostMessage = useCallback(
    ({ type, data }: { type: string; data: any }) => {
      if (!window.opener) return;
      window.opener.postMessage(
        {
          type,
          data,
        },
        "*"
      );
    },
    []
  );

  const removeListener = useCallback(
    () => window.removeEventListener("beforeunload", onCloseWindow),
    [onCloseWindow]
  );
  return useMemo(
    () => ({ onFinish, removeListener, onPostMessage }),
    [onFinish, removeListener, onPostMessage]
  );
};

export default useBeforeUnload;
