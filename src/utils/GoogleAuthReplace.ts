import { GoogleAuthProps } from "src/types/auth";
import queryString from "query-string";
export const getGoogleAccessToken = ({
  clientId,
  redirectURI,
}: GoogleAuthProps) => {
  const query = queryString.stringify({
    client_id: clientId,
    redirect_uri: redirectURI,
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    prompt: "select_account",
    response_type: "token",
    hl: "en",
  });
  const url = `https://accounts.google.com/o/oauth2/auth?${query}`;
  window.location.href = url;
};
