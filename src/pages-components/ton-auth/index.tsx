import React, { useCallback, useEffect, useRef } from "react";
import { SearchParams } from "src/types";
import "./index.css";
import {
  THEME,
  TonConnectButton,
  TonConnectUIProvider,
  TonProofItemReplySuccess,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { OpenLoginParamConfig } from "src/types/auth";
import { sleep } from "@portkey/utils";

const timestamp = Date.now();

export interface TTonWalletInfo {
  timestamp: string;
  address: string;
  publicKey: string;
  signature: string;
}

interface TonAuthProps {
  from?: string;
  authInfo?: OpenLoginParamConfig;
  searchParams?: SearchParams;
  onCloseWindow?: () => void;
  onLoadingChange: (v: boolean) => void;
  onError: (v: string) => void;
}

export function Ton({
  from,
  searchParams,
  onLoadingChange,
  onError,
}: TonAuthProps) {
  const router = useRouter();
  const changeLoading =
    useRef<TonAuthProps["onLoadingChange"]>(onLoadingChange);
  // const { network, serviceURI } = searchParams;
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const userFriendlyAddressRef = useRef(userFriendlyAddress);

  useEffect(() => {
    changeLoading.current = onLoadingChange;
  });
  useEffect(() => {
    userFriendlyAddressRef.current = userFriendlyAddress;
  }, [userFriendlyAddress]);

  const init = useCallback(async () => {
    try {
      tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: { tonProof: String(timestamp) },
      });

      if (await tonConnectUI.connectionRestored) await tonConnectUI.disconnect();

      tonConnectUI.openModal();
    } catch (error) {
      console.error("Error during initialization:", error);
      onError("Initialization error");
    }
  }, [tonConnectUI, onError]);

  const redirect = useCallback(
    async (walletInfo: any) => {
      try {
        await sleep(200);
        const path =
          from === "portkey" ? "/portkey-auth-callback" : "/auth-callback";

        const wallet = {
          timestamp: String(timestamp),
          address: userFriendlyAddressRef.current,
          rawAddress: walletInfo?.account.address,
          publicKey: walletInfo?.account.publicKey,
          signature:
            (walletInfo?.connectItems?.tonProof as TonProofItemReplySuccess)
              ?.proof?.signature || '',
          proof: Object.assign(walletInfo?.connectItems?.tonProof, {
            stateInit: walletInfo?.account?.walletStateInit,
          }),
        } as TTonWalletInfo;

        const redirectURI = `${path}?type=tonWallet&token=${JSON.stringify(
          wallet
        )}`;
        router.push(redirectURI);
      } catch (error) {
        console.error("Error during redirection:", error);
        onError("Redirection error");
      }
    },
    [from, router, onError]
  );

  useEffect(() => {
    init();

    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      console.log("onStatusChange", walletInfo);
      if (walletInfo?.connectItems) redirect(walletInfo);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ton-wrapper">
      <TonConnectButton />
    </div>
  );
}

export default function TonAuth(props: TonAuthProps) {
  const { searchParams, authInfo } = props;

  const manifestUrl = authInfo?.manifestUrl || searchParams?.manifestUrl || "";

  if (!manifestUrl || typeof manifestUrl !== "string")
    return <div>Invalid manifestUrl</div>;

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      uiPreferences={{ theme: THEME.LIGHT }}
    >
      <Ton {...props} />
    </TonConnectUIProvider>
  );
}
