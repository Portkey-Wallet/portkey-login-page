import pcStyle from './pc-styles.module.css';
import mobileStyle from './mobile-styles.module.css';
import { Button, ConfigProvider } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getCountry, translateOperationEnumToStr } from 'src/utils/model';

import CommonImage from 'src/components/CommonImage';
import { entryPageData } from 'src/constants/entry';
import { useStyleProvider } from 'src/utils/mobile';
import { OpenLoginParamConfig } from 'src/types/auth';
import { OperationTypeEnum } from '@portkey/services';

export default function JumpEntry({ onApprove, authInfo }: { onApprove?: () => void; authInfo: OpenLoginParamConfig }) {
  const { logo, errorIcon, warningIcon } = entryPageData;
  const styles = useStyleProvider<Record<string, string>>({
    pcStyle,
    mobileStyle,
  });
  const [consumedData, setConsumedData] = useState<{ [x: string]: string | number | boolean } | undefined>({});
  const [ip, setIp] = useState<string | undefined>('--');
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const checkUserIp = useCallback(async (serviceUrl: string) => {
    try {
      const country = await getCountry(serviceUrl);
      setIp(country);
      // eslint-disable-next-line no-empty
    } catch (ignored) {}
  }, []);

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
      raw['Chain'] = realChainId === `AELF` ? `MainChain ${realChainId}` : `SideChain ${realChainId}`;
      raw['Guardian Type'] = guardianType;
      const guardianAccount = thirdPartyEmail || identifier;
      raw['Guardian Account'] = guardianAccount;
      raw['Time'] = new Date().toLocaleString();
      raw['IP'] = ip;
      setConsumedData(raw);
      checkUserIp(serviceURI);
      const isTokenTypeOp = operationType === OperationTypeEnum.managerApprove || operationType === OperationTypeEnum.transferApprove;
      console.log('isTokenTypeOp && (!symbol || !amount)', isTokenTypeOp && (!symbol || !amount));
      if(isTokenTypeOp && (!symbol || !amount)) {
        setShowWarning(true);
      }
    } catch (e) {
      console.error(e);
      setConsumedData(undefined);
    }
  }, [authInfo, checkUserIp, ip, onApprove]);

  return (
    <ConfigProvider>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <CommonImage src={logo.src} style={{ width: logo.width, height: logo.height }} alt={logo.alt} priority />
          <div className={styles.introductionText}>
            {'Verification details are as follows. Proceed only if all data matches:'}
          </div>
          {showWarning && (
            <div className={styles.warningContainer}>
              <CommonImage
                src={warningIcon.src}
                style={{ width: errorIcon.width, height: errorIcon.height }}
                alt={errorIcon.alt}
                priority
              />
              <div className={styles.warningText}>
                {'Unknown authorization, please proceed with caution'}
              </div>
            </div>
          )}
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
              <div className={styles.infoLine}>
                <CommonImage
                  src={errorIcon.src}
                  style={{ width: errorIcon.width, height: errorIcon.height }}
                  alt={errorIcon.alt}
                  priority
                />
                <div className={styles.errorText}>Invalid parameter.</div>
              </div>
            )}
          </div>
          {!!consumedData && (
            <Button type="primary" className={styles.jumpBtn} onClick={onApprove}>
              <div className={styles.jumpBtnText}>Agree</div>
            </Button>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
