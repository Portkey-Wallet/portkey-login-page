import queryString from "query-string";

const tOauthSignatureKey = "oauth_signature=";
const formatTwitterSignatureWithToken = (token: string) => {
  // const strArr = token.split(tOauthSignatureKey);
  // const signatureKV = strArr[1];
  // const signatureStr = signatureKV.replaceAll('"', "");

  // return (
  //   strArr[0] +
  //   tOauthSignatureKey +
  //   '"' +
  //   encodeURIComponent(signatureStr) +
  //   '"'
  // );

  const strArr = token.split(",");
  // console.log(strArr, "strArr==");
  let _token = "";
  strArr.forEach((item) => {
    if (item.startsWith(tOauthSignatureKey)) {
      const signatureStr = item.split('"');

      _token =
        _token +
        tOauthSignatureKey +
        `"${encodeURIComponent(signatureStr[1])}"` +
        ",";
    } else {
      _token = _token + item + ",";
    }
  });
  if (_token.slice(-1) === ",") _token = _token.slice(0, -1);
  return _token;
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
    state,
  } = queryString.parse(location.search);
  let idToken = id_token;

  if (hash && type !== "Facebook") {
    const searchParams = queryString.parse(location.hash);
    token = searchParams.access_token;
    if (!token) throw "Invalid token access_token in query string";
    provider = "Google";
    idToken = searchParams.id_token;
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
      const searchParams = queryString.parse(location.hash);
      console.log(idToken, "idToken==");
      if (searchParams.id_token || state === "zklogin") {
        token = searchParams.code;
        idToken = searchParams.id_token;
      } else {
        token = JSON.stringify({
          token: authToken,
          userId,
          expiresTime,
        });
      }

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
    idToken,
    provider,
  };
};
