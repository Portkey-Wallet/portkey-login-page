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
  const resText = await fetchResult.text();
  try {
    return JSON.parse(resText);
  } catch (error) {
    return resText;
  }
};
