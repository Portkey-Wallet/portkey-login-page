export const TwitterAuthV1 = (serviceURI: string) => {
  const href = `${serviceURI}/api/app/twitterAuth/login`;

  location.href = href;
};
