import { sleep } from "@portkey/utils";
import { Toast } from "src/components/Toast/ToastShow";

export const tabMessagePush = async ({
  url,
  params,
}: {
  url: string;
  params: Record<string, string>;
}) => {
  const fetchResult = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "text/plain;v=1.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!fetchResult.ok) {
    throw new Error("Network error");
  }
  const resText = await fetchResult.text();
  try {
    return JSON.parse(resText);
  } catch (error) {
    return resText;
  }
};

export const sendTabMessage = async (
  params: {
    serviceURI: string;
    clientId: string;
    methodName: string;
    data: string;
  },
  times = 0
): Promise<any> => {
  const { serviceURI, clientId, methodName, data } = params;

  try {
    return await tabMessagePush({
      url: `${serviceURI}/api/app/tab/complete`,
      params: {
        clientId,
        methodName,
        data,
      },
    });
  } catch (error: any) {
    const currentTimes = ++times;
    await sleep(500);
    if (currentTimes > 5) {
      const err = error?.message || "Network error";
      Toast.show(err);
      throw err;
    }

    return sendTabMessage(params, currentTimes);
  }
};
