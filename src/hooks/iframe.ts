import { useCallback, useMemo, useRef } from "react";

export const useSendMessageByIframe = ({ target }: { target?: string }) => {
  const targetRef = useRef<string | undefined>(target);
  targetRef.current = target;

  const onSuccess = useCallback(
    ({ type, data }: { type: string; data: any }) => {
      window.parent.postMessage(
        {
          type,
          data,
          target: targetRef.current,
        },
        "*"
      );
      window.close();
    },
    []
  );

  return useMemo(() => ({ onSuccess }), [onSuccess]);
};
