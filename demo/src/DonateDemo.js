import React from 'react';
import { DonateWidget, renderWidget } from '../../src/';
import { initTranslations } from '../../src/shared/translations';
import { DonationPanel, DonationConnect } from '../../src/donate/components';
import { CustomerPanel, CustomerConnect } from '../../src/donate/components';
import { FundraisingPanel, FundraisingConnect } from '../../src/donate/components';
import { PaymentPanel, PaymentConnect } from '../../src/donate/components';
import { SuccessPanel, SuccessConnect } from '../../src/donate/components';
import '../../src/donate/style.scss';

function getCoverFeesAmount(donationAmount) {
  return donationAmount * 0.05;
}

window.renderDonateWidget = async (props) => {

  await initTranslations({
    translationsPath: 'translations/{{lng}}.json',
    defaultLanguage: 'en',
  });

  DonateWidget.init();

  DonateWidget.setPanels([
    {
      component: DonationPanel,
      connect: DonationConnect,
      settings: {
        tabName: 'Amount',
        hideHeader: true,
        priceHandleStyle: 'price-only',
      },
    },
    {
      component: CustomerPanel,
      connect: CustomerConnect,
      settings: {
        tabName: 'Details',
        hideHeader: true,
        showExpressCheckoutBtns: true,
        showMobile: true,
        showPhoneCountrySelect: true,
        showCountry: true,
        showCustomerType: true,
      },
    },
    // {
    //   component: FundraisingPanel,
    //   connect: FundraisingConnect,
    //   settings: {
    //     tabName: 'Fundraising',
    //     hideHeader: true,
    //   },
    // },
    {
      component: PaymentPanel,
      connect: PaymentConnect,
      settings: {
        tabName: 'Payment',
        hideHeader: true,
        // hideStartDate: true,
        submitBtnText: 'Donate',
        calcFeesFn: getCoverFeesAmount,
      },
    },
    {
      component: SuccessPanel,
      connect: SuccessConnect,
      settings: {
        hideTab: true,
        title: 'Donation Received',
      },
    },
  ]);

  renderWidget(props.elementId, <DonateWidget layout="tabs" {...props} />);
};

export default class DonateDemo extends React.Component {
  componentDidMount() {
    window.renderDonateWidget({
      elementId: 'donate-widget-demo',

      // baseline
      storeUid: 'str_wey5',
      singleOfferId: '8',
      recurringOfferId: '17',

      // tnc
      // storeUid: 'str_oymo',
      // singleOfferId: '8',
      // recurringOfferId: '17',
      // turnstileSiteKey: '0x4AAAAAAAxYtDTCw9FdH-SC',

      // church
      // storeUid: 'str_7e1l',
      // singleOfferId: '8',
      // recurringOfferId: '17',

      // storeUid: 'str_mp60', // tnc-hk
      // storeUid: 'str_l9p7',

      // singleOfferId: '1001',
      // recurringOfferId: '1002',

      // storeUid: 'str_8qx4',
      // singleOfferId: '103',
      // recurringOfferId: '105',

      // tnc-hk
      // storeUid: 'str_mp60',
      // singleOfferId: '1001',
      // recurringOfferId: '1002',


      fundraisingPageUid: 'abc-123',

      sourceId: '17',
      responseId: 'e9c2e351d90b11e996fd',
      emailResponseId: '1234',

      // defaultFrequency: 'recurring', //single|recurring

      // givingTypeOptions: [
      //     "General Donation",
      //     "Mission Work",
      //     "Children\'s Ministry",
      //     "Church Tithe",
      //     "Other"
      // ],

      // reCaptchaKey: '1234',

      showStepIndicator: true,

      // addressFinderKey: 'ADDRESSFINDER_DEMO_KEY',
      // defaultCountry: 'NZ',

      confirmPageUrl: 'http://google.com/',

      // createSaleOnCustomerPanel: true,

      requiredLabelType: '*',
      // requiredLabelType: 'optional',
    });
  }

  render() {
    return (
      <div className="container my-5">
        <div className="row">
    
          <div className="col-lg-6">
            <h2 style={headingStyle}>
              Donate now. <span className="text-muted">Human Fund needs your help.</span>
            </h2>
            <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
            <p className="lead">Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </div>

          <div className="col-lg-6">
            <div id="donate-widget-demo"></div>
          </div>
    
        </div>
      </div>
    );
  }
}

const headingStyle = {
  fontWeight: "400",
  fontSize: "50px",
  margin: "7rem 0 2rem",
};
