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
