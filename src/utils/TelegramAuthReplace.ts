import { stringifyUrl } from "query-string";
const oAuthTelegramURL = "https://oauth.telegram.org/auth";

export const getTelegramAuthToken = ({
  botId,
  requestAccess = "write",
  redirectUrl,
  origin,
  lang = "en",
}: {
  botId: string;
  requestAccess?: string;
  redirectUrl?: string;
  lang?: string;
  origin: string;
}) => {
  return stringifyUrl(
    {
      url: oAuthTelegramURL,
      query: {
        bot_id: botId,
        request_access: requestAccess,
        origin,
        embed: 1,
        return_to: redirectUrl,
        lang,
      },
    },
    { encode: true }
  );
};
