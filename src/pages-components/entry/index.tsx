import pcStyle from './pc-styles.module.css';
import mobileStyle from './mobile-styles.module.css';
import { Button, ConfigProvider } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getCountry, isInWarningWhiteList, translateOperationEnumToStr } from 'src/utils/model';

import { useStyleProvider } from 'src/utils/mobile';
import { OpenLoginParamConfig } from 'src/types/auth';
import { CustomSvg } from '@portkey/did-ui-react';
import Footer from 'src/components/Footer';

export default function JumpEntry({ onApprove, authInfo }: { onApprove?: () => void; authInfo: OpenLoginParamConfig }) {
  const styles = useStyleProvider<Record<string, string>>({
    pcStyle,
    mobileStyle,
  });
  const [consumedData, setConsumedData] = useState<{ [x: string]: string | number | boolean } | undefined>();
  const [ip, setIp] = useState<string | undefined>('--');
  const [warning, setWarning] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);
  const checkUserIp = useCallback(async (serviceUrl: string) => {
    try {
      const country = await getCountry(serviceUrl);
      setIp(country);
      // eslint-disable-next-line no-empty
    } catch (ignored) {}
  }, []);
  useEffect(() => {
    const theme = authInfo.theme;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });
  useEffect(() => {
    try {
      if (!authInfo) throw new Error('invalid data');
      console.log(authInfo, 'entryPrams===');
      const { approveDetail, serviceURI } = authInfo;
      if (!approveDetail) return onApprove?.();
      const { symbol, amount, originChainId, targetChainId, operationType, guardian } = approveDetail;
      const { guardianType, identifier, thirdPartyEmail } = guardian;
      if (!serviceURI || !guardianType) {
        throw new Error('invalid data');
      }
      const raw: any = {};
      raw['Operation Type'] = translateOperationEnumToStr(operationType);
      symbol && (raw['Token'] = symbol);
      (amount || typeof amount === 'number') && (raw['Amount'] = amount);
      const realChainId = targetChainId || originChainId;
      if (realChainId) {
        raw['Chain'] = realChainId === `AELF` ? `MainChain ${realChainId}` : `SideChain ${realChainId}`;
      } else {
        raw['Chain'] = 'Unknown';
      }
      raw['Guardian Type'] = guardianType;
      const guardianAccount = thirdPartyEmail || identifier;
      raw['Guardian Account'] = guardianAccount;
      raw['Time'] = new Date().toLocaleString();
      raw['IP'] = ip;
      setConsumedData(raw);
      checkUserIp(serviceURI);
      const isWarningWhiteList = isInWarningWhiteList(operationType);
      if (isWarningWhiteList) {
        setWarning(false);
      } else {
        setWarning((!symbol || !amount));
      }
    } catch (e) {
      console.error(e);
      setConsumedData(undefined);
    } finally {
      setInit(true);
    }
  }, [authInfo, checkUserIp, ip, onApprove]);

  return (
    <ConfigProvider>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <CustomSvg type="PortkeyLogo" className={styles.logo} />
          <div className={styles.contentWrapper}>
            <div className={styles.introductionText}>
              {'Verification details are as follows. Proceed only if all data matches:'}
            </div>
            {warning && (
              <div className={styles.warningWrapper}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill={authInfo.theme === 'dark' ? '#FDD10E' : '#9C820E'}
                  xmlns="http://www.w3.org/2000/svg">
                  <g id="error">
                    <path
                      className={styles.pathError}
                      id="Vector"
                      d="M10.9999 15.5834C11.2596 15.5834 11.4773 15.4955 11.653 15.3198C11.8287 15.1441 11.9166 14.9264 11.9166 14.6667C11.9166 14.407 11.8287 14.1893 11.653 14.0136C11.4773 13.8379 11.2596 13.75 10.9999 13.75C10.7402 13.75 10.5225 13.8379 10.3468 14.0136C10.1711 14.1893 10.0833 14.407 10.0833 14.6667C10.0833 14.9264 10.1711 15.1441 10.3468 15.3198C10.5225 15.4955 10.7402 15.5834 10.9999 15.5834ZM10.9999 11.9167C11.2596 11.9167 11.4773 11.8289 11.653 11.6532C11.8287 11.4775 11.9166 11.2598 11.9166 11V7.33337C11.9166 7.07365 11.8287 6.85594 11.653 6.68025C11.4773 6.50455 11.2596 6.41671 10.9999 6.41671C10.7402 6.41671 10.5225 6.50455 10.3468 6.68025C10.1711 6.85594 10.0833 7.07365 10.0833 7.33337V11C10.0833 11.2598 10.1711 11.4775 10.3468 11.6532C10.5225 11.8289 10.7402 11.9167 10.9999 11.9167ZM10.9999 20.1667C9.73186 20.1667 8.5402 19.9261 7.42492 19.4448C6.30964 18.9636 5.3395 18.3105 4.5145 17.4855C3.6895 16.6605 3.03638 15.6903 2.55513 14.575C2.07388 13.4598 1.83325 12.2681 1.83325 11C1.83325 9.73198 2.07388 8.54032 2.55513 7.42504C3.03638 6.30976 3.6895 5.33962 4.5145 4.51462C5.3395 3.68962 6.30964 3.0365 7.42492 2.55525C8.5402 2.074 9.73186 1.83337 10.9999 1.83337C12.268 1.83337 13.4596 2.074 14.5749 2.55525C15.6902 3.0365 16.6603 3.68962 17.4853 4.51462C18.3103 5.33962 18.9635 6.30976 19.4447 7.42504C19.926 8.54032 20.1666 9.73198 20.1666 11C20.1666 12.2681 19.926 13.4598 19.4447 14.575C18.9635 15.6903 18.3103 16.6605 17.4853 17.4855C16.6603 18.3105 15.6902 18.9636 14.5749 19.4448C13.4596 19.9261 12.268 20.1667 10.9999 20.1667Z"
                      fill="#EB7D50"
                    />
                  </g>
                </svg>
                <div className={styles.warningTitle}>{'Unknown authorization, please proceed with caution'}</div>
              </div>
            )}
            {init && (
              <div className={styles.dashboard}>
                {consumedData ? (
                  Object.entries(consumedData).map(([key, value]) => {
                    return (
                      <div className={styles.infoLine} key={key}>
                        <div className={styles.infoTitle}>{key}</div>
                        <div className={styles.infoContent}>{value}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.infoLineError} style={{ height: 240 }}>
                    <div className={styles.infoLineErrorWrapper}>
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill={authInfo.theme === 'dark' ? '#EB7D50' : '#B73907'}
                        xmlns="http://www.w3.org/2000/svg">
                        <g id="error">
                          <path
                            className={styles.pathError}
                            id="Vector"
                            d="M10.9999 15.5834C11.2596 15.5834 11.4773 15.4955 11.653 15.3198C11.8287 15.1441 11.9166 14.9264 11.9166 14.6667C11.9166 14.407 11.8287 14.1893 11.653 14.0136C11.4773 13.8379 11.2596 13.75 10.9999 13.75C10.7402 13.75 10.5225 13.8379 10.3468 14.0136C10.1711 14.1893 10.0833 14.407 10.0833 14.6667C10.0833 14.9264 10.1711 15.1441 10.3468 15.3198C10.5225 15.4955 10.7402 15.5834 10.9999 15.5834ZM10.9999 11.9167C11.2596 11.9167 11.4773 11.8289 11.653 11.6532C11.8287 11.4775 11.9166 11.2598 11.9166 11V7.33337C11.9166 7.07365 11.8287 6.85594 11.653 6.68025C11.4773 6.50455 11.2596 6.41671 10.9999 6.41671C10.7402 6.41671 10.5225 6.50455 10.3468 6.68025C10.1711 6.85594 10.0833 7.07365 10.0833 7.33337V11C10.0833 11.2598 10.1711 11.4775 10.3468 11.6532C10.5225 11.8289 10.7402 11.9167 10.9999 11.9167ZM10.9999 20.1667C9.73186 20.1667 8.5402 19.9261 7.42492 19.4448C6.30964 18.9636 5.3395 18.3105 4.5145 17.4855C3.6895 16.6605 3.03638 15.6903 2.55513 14.575C2.07388 13.4598 1.83325 12.2681 1.83325 11C1.83325 9.73198 2.07388 8.54032 2.55513 7.42504C3.03638 6.30976 3.6895 5.33962 4.5145 4.51462C5.3395 3.68962 6.30964 3.0365 7.42492 2.55525C8.5402 2.074 9.73186 1.83337 10.9999 1.83337C12.268 1.83337 13.4596 2.074 14.5749 2.55525C15.6902 3.0365 16.6603 3.68962 17.4853 4.51462C18.3103 5.33962 18.9635 6.30976 19.4447 7.42504C19.926 8.54032 20.1666 9.73198 20.1666 11C20.1666 12.2681 19.926 13.4598 19.4447 14.575C18.9635 15.6903 18.3103 16.6605 17.4853 17.4855C16.6603 18.3105 15.6902 18.9636 14.5749 19.4448C13.4596 19.9261 12.268 20.1667 10.9999 20.1667Z"
                            fill="#EB7D50"
                          />
                        </g>
                      </svg>
                      <div className={styles.errorText}>Invalid parameter.</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {!!consumedData && (
            <Button type="primary" className={styles.jumpBtn} onClick={onApprove}>
              <div className={styles.jumpBtnText}>Agree</div>
            </Button>
          )}
          <Footer className={styles.medium} />
        </div>
      </div>
    </ConfigProvider>
  );
}
