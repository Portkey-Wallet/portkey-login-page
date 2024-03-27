"use client";
import {
  errorTip,
  GuardianApproval as GuardianApprovalComponent,
  handleErrorMessage,
  PortkeyStyleProvider,
} from "@portkey/did-ui-react";
import type { NetworkType, UserGuardianStatus } from "@portkey/did-ui-react";
import { ChainId } from "@portkey/types";
import { OperationTypeEnum } from "@portkey/services";
import { useCallback, useEffect, useRef, useState } from "react";
// import BackHeaderForPage from "src/components/BackHeaderForPage";
import Loading from "src/components/Loading";
import { formatGuardianValue, getGuardianList } from "src/utils/guardians";
import { getOperationDetails } from "src/utils/manager";
// import { GuardianApprovedItem } from "src/types/guardians";
import { useSearchParams } from "next/navigation";
import "@portkey/did-ui-react/dist/assets/index.css";
import "./index.css";

export default function GuardianApproval() {
  const searchParams = useSearchParams();

  // search params
  const networkType = useRef(searchParams.get("networkType") as NetworkType);
  const originChainId = useRef(searchParams.get("originChainId") as ChainId);
  const targetChainId = useRef(searchParams.get("targetChainId") as ChainId);
  const caHash = useRef(searchParams.get("caHash") as string);
  const identifier = useRef(searchParams.get("identifier") as string);
  const operationType = useRef(
    Number(searchParams.get("operationType")) as OperationTypeEnum
  );
  const isErrorTip = useRef(searchParams.get("isErrorTip") === "true");

  // page state
  const [loading, setLoading] = useState(false);
  const operationDetails = getOperationDetails(operationType.current);
  const [guardianList, setGuardianList] = useState<UserGuardianStatus[]>();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const _guardianList = await getGuardianList({
        identifier: identifier.current,
        caHash: caHash.current,
        originChainId: originChainId.current,
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
        isErrorTip.current
        // onApprovalError
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <PortkeyStyleProvider>
      <div className="guardian-approval-container">
        <GuardianApprovalComponent
          // header={<BackHeaderForPage title={""} leftElement={""} />}
          operationDetails={operationDetails}
          originChainId={originChainId.current}
          targetChainId={targetChainId.current}
          guardianList={guardianList}
          onConfirm={async (approvalInfo) => {
            const guardiansApproved = formatGuardianValue(approvalInfo);
            // TODO TG back
            console.log(">>>>>>>>>>> guardiansApproved", guardiansApproved);
            // await onApprovalSuccess(guardiansApproved);
          }}
          // onError={onApprovalError}
          networkType={networkType.current}
          operationType={operationType.current}
        />
        <Loading loading={loading} />
      </div>
    </PortkeyStyleProvider>
  );
}
