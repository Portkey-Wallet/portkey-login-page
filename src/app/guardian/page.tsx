"use client";
import {
  errorTip,
  GuardianAdd as GuardianAddComponent,
  GuardianEdit as GuardianEditComponent,
  GuardianView as GuardianViewComponent,
  handleErrorMessage,
} from "@portkey/did-ui-react";
import type { UserGuardianStatus } from "@portkey/did-ui-react";
import "@portkey/did-ui-react/dist/assets/index.css";
import "./index.css";
import { VerifierItem } from "@portkey/did";
import { GuardiansApproved } from "@portkey/services";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { base64toJSON } from "src/utils";
import {
  DefaultGuardianLocationState,
  GUARDIAN_ADD_SESSION_KEY,
  GUARDIAN_REMOVE_SESSION_KEY,
  GUARDIAN_VIEW_SESSION_KEY,
  GuardianStep,
} from "src/constants/guardians";
import {
  pushEncodeMessage,
  CrossTabPushMessageType,
} from "src/utils/crossTabMessagePush";
import { getGuardianList } from "src/utils/guardians";
import { getVerifierListHandler } from "src/utils/guardians/verifier";
import Loading from "src/components/Loading";
import { GuardianLocationState } from "src/types/guardians";

export default function Guardian() {
  const searchParams = useSearchParams();

  // search params
  const b64Params = searchParams.get("b64Params") || "";
  const pageInfo: GuardianLocationState = useMemo(() => {
    try {
      const data = base64toJSON(b64Params);
      console.log(data, "b64Params===");
      return data as GuardianLocationState;
    } catch (error) {
      return DefaultGuardianLocationState;
    }
  }, [b64Params]);

  // page state
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<GuardianStep>(
    pageInfo.guardianStep || GuardianStep.guardianView
  );
  const [guardianList, setGuardianList] = useState<UserGuardianStatus[]>();
  const [preGuardian, setPreGuardian] = useState<UserGuardianStatus>();
  const [verifierList, setVerifierList] = useState<
    VerifierItem[] | undefined
  >();
  const verifierMap = useRef<{ [x: string]: VerifierItem }>();
  const editable = useMemo(
    () => Number(guardianList?.length) > 1,
    [guardianList?.length]
  );

  const fetchGuardianList = useCallback(async () => {
    try {
      const _guardianList = await getGuardianList({
        caHash: pageInfo.caHash,
        originChainId: pageInfo.originChainId,
        chainType: pageInfo.chainType,
      });
      _guardianList.reverse();
      setGuardianList(_guardianList);
      return _guardianList;
    } catch (error) {
      errorTip(
        {
          errorFields: "GetGuardianList",
          error: handleErrorMessage(error),
        },
        pageInfo.isErrorTip
      );
    }
  }, [
    pageInfo.caHash,
    pageInfo.chainType,
    pageInfo.isErrorTip,
    pageInfo.originChainId,
  ]);

  const getVerifierInfo = useCallback(async () => {
    try {
      const list = await getVerifierListHandler({
        originChainId: pageInfo.originChainId,
        chainType: pageInfo.chainType,
      });
      setVerifierList(list);
      const _verifierMap: { [x: string]: VerifierItem } = {};
      list?.forEach((item: VerifierItem) => {
        _verifierMap[item.id] = item;
      }, []);
      verifierMap.current = _verifierMap;
    } catch (error) {
      errorTip(
        {
          errorFields: "getVerifierServers",
          error: handleErrorMessage(error),
        },
        pageInfo.isErrorTip
      );
    }
  }, [pageInfo.chainType, pageInfo.isErrorTip, pageInfo.originChainId]);

  const getData = useCallback(async () => {
    setLoading(true);
    await getVerifierInfo();
    await fetchGuardianList();
    setLoading(false);
  }, [fetchGuardianList, getVerifierInfo]);

  const handleSetLoginGuardian = useCallback(
    async (
      operateGuardian: UserGuardianStatus,
      approvalInfo: GuardiansApproved[]
    ) => {
      // save data
      // back dapp webapp to execute the next step of the process
      const session = sessionStorage.getItem(GUARDIAN_VIEW_SESSION_KEY);
      if (session) {
        await pushEncodeMessage(
          session,
          CrossTabPushMessageType.onSetLoginGuardianResult,
          JSON.stringify({ currentGuardian: operateGuardian, approvalInfo })
        );
        return;
      }
    },
    []
  );

  const handleAddGuardian = useCallback(
    async (
      operateGuardian: UserGuardianStatus,
      approvalInfo: GuardiansApproved[]
    ) => {
      // save data
      // back dapp webapp to execute the next step of the process
      const session = sessionStorage.getItem(GUARDIAN_ADD_SESSION_KEY);
      if (session) {
        await pushEncodeMessage(
          session,
          CrossTabPushMessageType.onAddGuardianResult,
          JSON.stringify({ currentGuardian: operateGuardian, approvalInfo })
        );
        return;
      }
    },
    []
  );

  const handleRemoveGuardian = useCallback(
    async (approvalInfo: GuardiansApproved[]) => {
      // save data
      // back dapp webapp to execute the next step of the process
      const session = sessionStorage.getItem(GUARDIAN_REMOVE_SESSION_KEY);
      if (session) {
        await pushEncodeMessage(
          session,
          CrossTabPushMessageType.onRemoveGuardianResult,
          JSON.stringify({
            currentGuardian: pageInfo.currentGuardian,
            approvalInfo,
          })
        );
        return;
      }
    },
    [pageInfo.currentGuardian]
  );

  const handleEditGuardian = useCallback(
    async (
      operateGuardian: UserGuardianStatus,
      approvalInfo: GuardiansApproved[]
    ) => {
      // save data
      // back dapp webapp to execute the next step of the process
      const session = sessionStorage.getItem(GUARDIAN_ADD_SESSION_KEY);
      if (session) {
        await pushEncodeMessage(
          session,
          CrossTabPushMessageType.onEditGuardianResult,
          JSON.stringify({ currentGuardian: operateGuardian, approvalInfo })
        );
        return;
      }
    },
    []
  );

  const onEditGuardian = useCallback(() => {
    setPreGuardian(pageInfo.currentGuardian);
    setStep(GuardianStep.guardianEdit);
  }, [pageInfo.currentGuardian]);

  useEffect(() => {
    // save session
    sessionStorage.setItem(
      GUARDIAN_VIEW_SESSION_KEY,
      JSON.stringify({
        loginId: pageInfo.loginId,
        publicKey: pageInfo.publicKey,
        serviceURI: pageInfo.serviceURI,
      })
    );
  }, [pageInfo.loginId, pageInfo.publicKey, pageInfo.serviceURI]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="guardian-container">
      {step === GuardianStep.guardianView && (
        <GuardianViewComponent
          originChainId={pageInfo.originChainId}
          networkType={pageInfo.networkType}
          currentGuardian={pageInfo.currentGuardian!}
          onEditGuardian={editable ? onEditGuardian : undefined}
          handleSetLoginGuardian={handleSetLoginGuardian}
          guardianList={guardianList}
        />
      )}
      {step === GuardianStep.guardianAdd && (
        <GuardianAddComponent
          caHash={pageInfo.caHash}
          originChainId={pageInfo.originChainId}
          networkType={pageInfo.networkType}
          chainType={pageInfo.chainType}
          verifierList={verifierList}
          guardianList={guardianList}
          handleAddGuardian={handleAddGuardian}
        />
      )}
      {step === GuardianStep.guardianEdit && (
        <GuardianEditComponent
          originChainId={pageInfo.originChainId}
          caHash={pageInfo.caHash}
          networkType={pageInfo.networkType}
          verifierList={verifierList}
          currentGuardian={pageInfo.currentGuardian}
          guardianList={guardianList}
          preGuardian={preGuardian}
          chainType={pageInfo.chainType}
          handleEditGuardian={handleEditGuardian}
          handleRemoveGuardian={handleRemoveGuardian}
          handleSetLoginGuardian={handleSetLoginGuardian}
        />
      )}
      <Loading loading={loading} />
    </div>
  );
}
