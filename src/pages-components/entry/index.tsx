import pcStyle from './pc-styles.module.css';
import mobileStyle from './mobile-styles.module.css';
import { Button, ConfigProvider } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getCountry, translateOperationEnumToStr } from 'src/utils/model';

import CommonImage from 'src/components/CommonImage';
import { entryPageData } from 'src/constants/entry';
import { useStyleProvider } from 'src/utils/mobile';
import { OpenLoginParamConfig } from 'src/types/auth';
import { CustomSvg } from '@portkey/did-ui-react';
import Footer from 'src/components/Footer';

export default function JumpEntry({ onApprove, authInfo }: { onApprove?: () => void; authInfo: OpenLoginParamConfig }) {
  const { errorIcon } = entryPageData;
  const styles = useStyleProvider<Record<string, string>>({
    pcStyle,
    mobileStyle,
  });
  const [consumedData, setConsumedData] = useState<{ [x: string]: string | number | boolean } | undefined>({});
  const [ip, setIp] = useState<string | undefined>('--');

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
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  })
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
      if(realChainId){
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
    } catch (e) {
      console.error(e);
      setConsumedData(undefined);
    }
  }, [authInfo, checkUserIp, ip, onApprove]);

  return (
    <ConfigProvider>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* <CommonImage src={logo.src} style={{ width: logo.width, height: logo.height }} alt={logo.alt} priority /> */}
          <CustomSvg type='PortkeyLogo' className={styles.logo}/>
          <div className={styles.contentWrapper}>
            <div className={styles.introductionText}>
              {'Verification details are as follows. Proceed only if all data matches:'}
            </div>
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
          </div>
          {!!consumedData && (
            <Button type="primary" className={styles.jumpBtn} onClick={onApprove}>
              <div className={styles.jumpBtnText}>Agree</div>
            </Button>
          )}
          <Footer className={styles.medium}/>
        </div>
      </div>
    </ConfigProvider>
  );
}
