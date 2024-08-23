export const facebookAuthReplace = ({
  clientId,
  version = "v19.0",
  redirectURI,
  state = "origin:web",
}: {
  clientId: string;
  version?: string;
  redirectURI?: string;
  state?: string;
}) => {
  const url = `https://www.facebook.com/${version}/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`;
  window.location.href = url;
};

export const facebookAuthReplaceWithZkLogin = ({
  clientId,
  version = "v19.0",
  redirectURI,
  state = "zklogin",
  nonce,
}: {
  clientId: string;
  version?: string;
  redirectURI?: string;
  state?: string;
  nonce?: string;
}) => {
  const url = `https://www.facebook.com/${version}/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectURI}&scope=openid&state=${state}&nonce=${nonce}&response_type=code%20id_token`;
  window.location.href = url;
};
