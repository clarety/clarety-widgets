import React from 'react';
import { DonatePage, renderWidget } from '../../src/';
import { PageDonationPanel, DonationConnect } from '../../src/donate/components';
import { PageCustomerPanel, CustomerConnect } from '../../src/donate/components';
// import { PageFundraisingPanel, FundraisingConnect } from '../../src/donate/components';
import { PagePaymentPanel, PaymentConnect } from '../../src/donate/components';
import '../../src/donate/style.scss';

window.renderDonatePage = (props) => {
  DonatePage.init();

  DonatePage.setPanels([
    {
      component: PageDonationPanel,
      connect: DonationConnect,
      settings: {},
    },
    {
      component: PageCustomerPanel,
      connect: CustomerConnect,
      settings: {},
    },
    // {
    //   component: PageFundraisingPanel,
    //   connect: FundraisingConnect,
    //   settings: {},
    // },
    {
      component: PagePaymentPanel,
      connect: PaymentConnect,
      settings: {},
    },
  ]);

  renderWidget(props.elementId, <DonatePage {...props} />);
};

export default class DonatePageDemo extends React.Component {
  componentDidMount() {
    window.renderDonatePage({
      elementId: 'donate-page-demo',
      showFundraising: true,
      fundraisingPageUid: 'abc-123',
      storeCode: 'AU',
      singleOfferId: '8',
      recurringOfferId: '17',
      sourceId: '17',
      responseId: 'e9c2e351d90b11e996fd',
      emailResponseId: '1234',
      // reCaptchaKey: '1234',
    });
  }

  render() {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col">
            <div id="donate-page-demo"></div>
          </div>
        </div>
      </div>
    );
  }
}
