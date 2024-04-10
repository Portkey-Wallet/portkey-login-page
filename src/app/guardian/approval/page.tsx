"use client";
import {
  errorTip,
  GuardianApproval as GuardianApprovalComponent,
  handleErrorMessage,
  PortkeyStyleProvider,
} from "@portkey/did-ui-react";
import type { UserGuardianStatus } from "@portkey/did-ui-react";
import { OperationTypeEnum, GuardiansApproved } from "@portkey/services";
import { useCallback, useEffect, useMemo, useState } from "react";
// import BackHeaderForPage from "src/components/BackHeaderForPage";
import Loading from "src/components/Loading";
import { getGuardianList } from "src/utils/guardians";
import { getOperationDetails } from "src/utils/manager";
// import { GuardianApprovedItem } from "src/types/guardians";
import { useSearchParams } from "next/navigation";
import "@portkey/did-ui-react/dist/assets/index.css";
import "./index.css";
import { GuardianApprovalLocationState } from "src/types/guardians";
import { base64toJSON } from "src/utils";
import { DefaultGuardianApprovalLocationState } from "src/constants/guardians";
import {
  CrossTabPushMessageType,
  pushEncodeMessage,
} from "src/utils/crossTabMessagePush";
import PoweredFooter from "src/components/PoweredFooter";

export default function GuardianApproval() {
  const searchParams = useSearchParams();

  // search params
  const b64Params = searchParams.get("b64Params") || "";
  const pageInfo: GuardianApprovalLocationState = useMemo(() => {
    try {
      const data = base64toJSON(b64Params);
      console.log(data, "b64Params===");
      return data as GuardianApprovalLocationState;
    } catch (error) {
      return DefaultGuardianApprovalLocationState;
    }
  }, [b64Params]);
  const operationType = useMemo(
    () => Number(pageInfo.operationType) as OperationTypeEnum,
    [pageInfo]
  );
  const sessionAuth = useMemo(
    () =>
      JSON.stringify({
        loginId: pageInfo.loginId,
        publicKey: pageInfo.publicKey,
        serviceURI: pageInfo.serviceURI || "http://localhost:3002",
      }),
    [pageInfo.loginId, pageInfo.publicKey, pageInfo.serviceURI]
  );

  // page state
  const [loading, setLoading] = useState(false);
  const operationDetails = getOperationDetails(operationType);
  const [guardianList, setGuardianList] = useState<UserGuardianStatus[]>();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const _guardianList = await getGuardianList({
        identifier: pageInfo.identifier,
        caHash: pageInfo.caHash,
        originChainId: pageInfo.originChainId,
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
        // onApprovalError
      );
    } finally {
      setLoading(false);
    }
  }, [
    pageInfo.caHash,
    pageInfo.identifier,
    pageInfo.isErrorTip,
    pageInfo.originChainId,
  ]);

  const onApprovalSuccess = useCallback(
    async (approvalInfo: GuardiansApproved[]) => {
      // const guardiansApproved = formatGuardianValue(approvalInfo);
      // console.log(">>>>>>>>>>> guardiansApproved", guardiansApproved);

      // save data
      // back dapp webapp to execute the next step of the process
      if (sessionAuth) {
        await pushEncodeMessage(
          sessionAuth,
          CrossTabPushMessageType.onGuardianApprovalResult,
          JSON.stringify({ approvalInfo }) //guardiansApproved
        );
        return;
      }
    },
    [sessionAuth]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <PortkeyStyleProvider>
      <div className="guardian-approval-container">
        <GuardianApprovalComponent
          // header={<BackHeaderForPage title={""} leftElement={""} />}
          operationDetails={operationDetails}
          originChainId={pageInfo.originChainId}
          targetChainId={pageInfo.targetChainId}
          guardianList={guardianList}
          onConfirm={onApprovalSuccess}
          // onError={onApprovalError}
          networkType={pageInfo.networkType}
          operationType={operationType}
        />
        <PoweredFooter />
        <Loading loading={loading} />
      </div>
    </PortkeyStyleProvider>
  );
}
