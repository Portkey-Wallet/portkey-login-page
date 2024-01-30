const TWITTER_URL: string = "https://twitter.com";

export const twitterAuth = ({
  clientId,
  redirectURI,
  scope = "users.read",
  state = "state",
  responseType = "code",
  codeChallenge = "challenge",
  codeChallengeMethod = "plain",
}: {
  clientId?: string;
  redirectURI: string;
  scope?: string;
  state?: string;
  responseType?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}) => {
  const href = `${TWITTER_URL}/i/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
  window.location.href = href;
};
