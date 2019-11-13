import React from 'react';
import { createDonatePage } from '../../src/';
import '../../src/donate/style.scss';

const DonatePage = createDonatePage();

const DonatePageDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">
        <DonatePage
          showFundraising={true}
          fundraisingPageUid="abc-123"

          storeCode="AU"

          singleOfferId="8"
          recurringOfferId="17"

          sourceId="17"
          responseId="e9c2e351d90b11e996fd"
          emailResponseId="1234"

          reCaptchaKey="1234"
        />
      </div>
    </div>
  </div>
);

export default DonatePageDemo;
