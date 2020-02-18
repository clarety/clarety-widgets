import React from 'react';
import { DonateWidget, renderWidget } from '../../src/';
import { DonationPanel, DonationConnect } from '../../src/donate/components';
import { CustomerPanel, CustomerConnect } from '../../src/donate/components';
import { FundraisingPanel, FundraisingConnect } from '../../src/donate/components';
import { PaymentPanel, PaymentConnect } from '../../src/donate/components';
import { SubmitPanel, SubmitConnect } from '../../src/donate/components';
import '../../src/donate/style.scss';

window.renderDonatePage = (props) => {
  DonateWidget.init();

  // TODO: this setting should come from the widgets/donate endpoint...
  DonateWidget.appSettings({
    startDates: ['2020-03-01', '2020-03-15', '2020-03-30'],
  });

  DonateWidget.setPanels([
    {
      component: DonationPanel,
      connect: DonationConnect,
      settings: {},
    },
    {
      component: CustomerPanel,
      connect: CustomerConnect,
      settings: {
        title: 'Your Details',
      },
    },
    {
      component: FundraisingPanel,
      connect: FundraisingConnect,
      settings: {
        title: 'Fundraising Details',
      },
    },
    {
      component: PaymentPanel,
      connect: PaymentConnect,
      settings: {
        title: 'Payment Details',
        paymentMethods: ['credit-card', 'direct-debit'],
      },
    },
    {
      component: SubmitPanel,
      connect: SubmitConnect,
      settings: {
        submitBtnText: 'Donate Now!',
      },
    },
  ]);

  renderWidget(props.elementId, <DonateWidget layout="page" {...props} />);
};

export default class DonatePageDemo extends React.Component {
  componentDidMount() {
    window.renderDonatePage({
      elementId: 'donate-page-demo',

      storeCode: 'AU',
      singleOfferId: '8',
      recurringOfferId: '17',
      fundraisingPageUid: 'abc-123',

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
