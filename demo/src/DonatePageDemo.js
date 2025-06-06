import React from 'react';
import { DonateWidget, renderWidget } from '../../src/';
import { DonationPanel, DonationConnect } from '../../src/donate/components';
import { ExpressDonationPanel } from '../../src/shared/components';
import { ExpressDonationConnect } from '../../src/donate/components';
import { CustomerPanel, CustomerConnect } from '../../src/donate/components';
import { FundraisingPanel, FundraisingConnect } from '../../src/donate/components';
import { PaymentPanel, PaymentConnect } from '../../src/donate/components';
import { SubmitPanel, SubmitConnect } from '../../src/donate/components';
import '../../src/donate/style.scss';

window.renderDonatePage = (props) => {
  DonateWidget.init();

  DonateWidget.setPanels([
    {
      component: DonationPanel,
      connect: DonationConnect,
      settings: {},
    },
    {
      component: ExpressDonationPanel,
      connect: ExpressDonationConnect,
      settings: {
        title: 'Express Donation',
      },
    },
    {
      component: CustomerPanel,
      connect: CustomerConnect,
      settings: {
        title: 'Your Details',
        showCustomerType: true,
        showSource: true,
        showCountry: true,
        showCustomerSubType: true,
      },
    },
    // {
    //   component: FundraisingPanel,
    //   connect: FundraisingConnect,
    //   settings: {
    //     title: 'Fundraising Details',
    //   },
    // },
    {
      component: PaymentPanel,
      connect: PaymentConnect,
      settings: {
        title: 'Payment Details'
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


      //bible league
      // storeUid: 'str_zj5v',
      // singleOfferId: '8',
      // recurringOfferId: '81',

      storeUid: 'str_wey5', // baseline
      // storeUid: 'str_k1or',
      // storeUid: 'str_8qx4',
      singleOfferId: '8',
      recurringOfferId: '17',
      //fundraisingPageUid: 'abc-123',
      //confirmPageUrl: 'https://google.com',
      // sourceId: '17',

      // defaultFrequency: 'recurring', //single|recurring
      responseId: 'e9c2e351d90b11e996fd',
      emailResponseId: '1234',
      // givingTypeOptions: [
      //   "Church Tithe",
      //   "General Donation",
      //   "Children\'s Ministry",
      //   "Other"
      // ]
      
      // reCaptchaKey: '1234',

      addressFinderKey: 'ADDRESSFINDER_DEMO_KEY',
      // defaultCountry: 'AU',
      defaultCountry: 'NZ',

      // hideCurrencyCode: true,
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
