import queryString from "query-string";

export const parseRedirectParams = () => {
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
      token = JSON.stringify({
        token: authToken,
        id,
        type,
        name,
        username,
      });

      provider = "Twitter";
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
