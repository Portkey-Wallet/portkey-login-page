import React, { useCallback, useEffect, useRef } from "react";
import { SearchParams } from "src/types";
import "./index.css";
import {
  THEME,
  TonConnectButton,
  TonConnectUIProvider,
  TonProofItemReplySuccess,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { OpenLoginParamConfig } from "src/types/auth";

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

  useEffect(() => {
    changeLoading.current = onLoadingChange;
  });

  const init = useCallback(async () => {
    tonConnectUI.setConnectRequestParameters({
      state: "ready",
      value: { tonProof: String(timestamp) },
    });

    if (await tonConnectUI.connectionRestored) await tonConnectUI.disconnect();

    tonConnectUI.openModal();
  }, [tonConnectUI]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      console.log("onStatusChange", walletInfo);
      if (walletInfo?.connectItems) {
        const path =
          from === "portkey" ? "/portkey-auth-callback" : "/auth-callback";

        const wallet = {
          timestamp: String(timestamp),
          address: walletInfo?.account.address,
          publicKey: walletInfo?.account.publicKey,
          signature:
            (walletInfo?.connectItems?.tonProof as TonProofItemReplySuccess)
              ?.proof?.signature || "",
        } as TTonWalletInfo;

        // TODO: change  it to real data
        const redirectURI = `${path}?type=tonWallet&token=${JSON.stringify(
          wallet
        )}`;
        router.push(redirectURI);
      }
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
