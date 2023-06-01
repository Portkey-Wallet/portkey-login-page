export interface GoogleAuthProps {
  scope?: string;
  prompt?: string;
  uxMode?: string;
  clientId: string;
  loginHint?: string;
  accessType?: string;
  autoSelect?: boolean;
  redirectURI?: string;
  cookiePolicy?: string;
  hostedDomain?: string;
  discoveryDocs?: string;
  children?: React.ReactNode;
  isOnlyGetToken?: boolean;
  typeResponse?: "idToken" | "accessToken";
  fetchBasicProfile?: boolean;
}
