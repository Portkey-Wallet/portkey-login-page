'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { base64toJSON } from 'src/utils';
import { OPENLOGIN_ACTIONS } from 'src/constants/social';
import SocialAuth from 'src/pages-components/social-auth';
import { OpenLoginParamConfig } from 'src/types/auth';
import JumpEntry from 'src/pages-components/entry';

export default function SocialStart() {
  const searchParams = useSearchParams();
  const b64Params = searchParams.get('b64Params') || '';

  const params = useMemo(() => {
    try {
      const data = base64toJSON(b64Params);
      console.log(data, 'b64Params===');
      return data as any;
    } catch (error) {
      return {};
    }
  }, [b64Params]);
  const [showAgree, setShowAggree] = useState<boolean>(true);
  const onApprove = useCallback(() => {
    setShowAggree(false);
  }, []);

  if (params?.actionType !== OPENLOGIN_ACTIONS.LOGIN) return <>`actionType` No Support</>;
  return (
    <div>
      {params.approveDetail && showAgree ? (
        <JumpEntry authInfo={params as OpenLoginParamConfig} onApprove={onApprove} />
      ) : (
        <SocialAuth authInfo={params as OpenLoginParamConfig} />
      )}
    </div>
  );
}
