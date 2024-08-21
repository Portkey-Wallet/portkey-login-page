import { IVerifyEntryParams } from 'src/utils/model';

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
  typeResponse?: 'idToken' | 'accessToken';
  fetchBasicProfile?: boolean;
  nonce?: string;
}

export interface BaseOpenLoginParam {
  actionType: string;
  from: string;
  loginId: string;
  loginProvider: string;
  network: string;
  publicKey: string;
  serviceURI: string;
  approveDetail?: IVerifyEntryParams;
}

export type OpenLoginParamConfig = BaseOpenLoginParam & Record<string, string>;

export type TOpenLoginSessionInfo = {
  loginId: string;
  publicKey: string;
  serviceURI: string;
  isFromTelegram: boolean;
};
