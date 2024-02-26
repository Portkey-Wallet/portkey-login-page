import queryString from "query-string";

const tOauthSignatureKey = "oauth_signature=";
const formatTwitterSignatureWithToken = (token: string) => {
  const strArr = token.split(tOauthSignatureKey);
  const signatureKV = strArr[1];
  const signatureStr = signatureKV.replaceAll('"', "");

  return (
    strArr[0] +
    tOauthSignatureKey +
    '"' +
    encodeURIComponent(signatureStr) +
    '"'
  );
};

export const parseRedirectParams = (parseParam?: {
  from?: "openlogin" | "portkey";
}) => {
  let token;
  let provider;
  let errorMessage;
  const hash = location.hash;
  const search = location.search;
  const {
    id_token,
    type,
    token: authToken,
    id,
    name,
    username,
    userId,
    expiresTime,
    code,
    message,
  } = queryString.parse(location.search);
  if (hash && type !== "Facebook") {
    const searchParams = queryString.parse(location.hash);
    token = searchParams.access_token;
    if (!token) throw "Invalid token access_token in query string";
    provider = "Google";
  } else if (search) {
    if (code) {
      errorMessage = message;
      return { code, message: errorMessage };
    }
    if (type === "telegram") {
      token = authToken;
      provider = "Telegram";
    } else if (type === "Twitter") {
      provider = "Twitter";
      if (parseParam?.from === "openlogin") {
        // token = `${(authToken)}&id=${id}&name=${name}&username=${username}`;
        console.log(authToken, "authToken===");

        const formatToken = formatTwitterSignatureWithToken(
          authToken as string
        );

        token = JSON.stringify({
          token: formatToken,
          id,
          type,
          name,
          username,
        });
        console.log(token, "token===");
      } else {
        token = JSON.stringify({
          token: authToken,
          id,
          type,
          name,
          username,
        });
      }
    } else if (type === "Facebook") {
      token = JSON.stringify({
        token: authToken,
        userId,
        expiresTime,
      });
      provider = type;
    } else if (authToken) {
      token = JSON.stringify({
        token: authToken,
        userId,
        expiresTime,
      });
      provider = type;
    } else {
      if (!id_token) throw "Invalid token id_token in query string";
      token = id_token;
      provider = "Apple";
    }
  } else {
    throw "Invalid token  in query string";
  }

  return {
    token,
    provider,
  };
};
