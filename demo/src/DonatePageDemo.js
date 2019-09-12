import React from 'react';
import { createDonatePage } from '../../src/';
import '../../src/donate/style.scss';

const DonatePage = createDonatePage();

const DonatePageDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">
        <DonatePage
          storeCode="AU"
          singleOfferCode="widget-single"
          recurringOfferCode="widget-recurring"
        />
      </div>
    </div>
  </div>
);

export default DonatePageDemo;
