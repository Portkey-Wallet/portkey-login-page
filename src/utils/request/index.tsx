export const tabMessagePushApi = async ({
  url,
  params,
}: {
  url: string;
  params: Record<string, string | boolean>;
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
