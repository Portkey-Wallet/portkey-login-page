import { CustomSvg } from "@portkey/did-ui-react";
import "./index.css";

export default function PoweredFooter() {
  return (
    <div className='open-login-powered-wrapper'>
      <div className='powered'>
        <div className='powered-by'>Powered By</div>
        <CustomSvg type='Portkey' />
        <div className='brand-name'>Portkey</div>
      </div>
    </div>
  );
}
