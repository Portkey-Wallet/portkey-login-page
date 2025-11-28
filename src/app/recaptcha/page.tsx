'use client';
import React, { useEffect, useMemo } from 'react';
import GoogleReCaptcha from 'src/components/GoogleReCaptcha';
import { BaseReCaptcha } from 'src/components/GoogleReCaptcha/types';
import { useSendMessageByIframe } from 'src/hooks/iframe';
import { TSearch } from 'src/types';
import './index.css';

export default function Recaptcha({ searchParams = {} }: { searchParams: TSearch }) {
  const { onSuccess } = useSendMessageByIframe({
    target: '@portkey/ui-did-react:ReCaptcha',
  });

  const {
    theme = 'light',
    siteKey = '6LfR_bElAAAAAJSOBuxle4dCFaciuu9zfxRQfQC0',
    size = 'normal',
  } = useMemo(() => {
    return searchParams as Omit<BaseReCaptcha, 'customReCaptchaHandler'>;
  }, [searchParams]);

  useEffect(() => {
    document.body.classList.add('recaptcha-body');
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      {siteKey ? (
        <GoogleReCaptcha
          theme={theme || 'light'}
          size={size || 'normal'}
          siteKey={siteKey}
          onSuccess={(res) => {
            onSuccess({
              type: 'PortkeyReCaptchaOnSuccess',
              data: res,
            });
          }}
          onError={(res) => {
            console.log(res, 'onError');
          }}
          onExpire={(err) => {
            console.log(err, 'onExpire');
          }}
        />
      ) : (
        'Invalid siteKey'
      )}
    </div>
  );
}
