import React from 'react';
import { FundraisingStart } from '../../src/';
import { LoginPanel } from '../../src/shared/components';
import { CampaignPanel, CampaignConnect, FundraisingStartLoginConnect } from '../../src/fundraising-start/components';
import '../../src/fundraising-start/style.scss';

FundraisingStart.init();

FundraisingStart.setTranslationsPath('translations/{{lng}}.json');

FundraisingStart.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb',
  prod: '',
});

FundraisingStart.setPanels([
  {
    component: CampaignPanel,
    connect: CampaignConnect,
    settings: {},
  },
  {
    component: LoginPanel,
    connect: FundraisingStartLoginConnect,
    settings: {
      allowGuest: false,
      createAccount: true,
      showFirstName: true,
      showLastName: true,
    },
  },
]);

const FundraisingStartDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">
        <FundraisingStart
          storeUid="str_8qx4"
          currencyCode="AUD"
          currencySymbol="$"
          seriesId="10"
          pageType="1"
          confirmPageUrl="http://dev-clarety-baseline.claretycontrol.com/sites/site-com-au/content/donate-confirm/gjf19l/donate-confirm"
          reCaptchaKey="..."
        />
      </div>
    </div>
  </div>
);

export default FundraisingStartDemo;
