import React from 'react';
import { DonateWidget, renderWidget } from '../../src/';
import { initTranslations } from '../../src/shared/translations';
import { DonationPanel, DonationConnect } from '../../src/donate/components';
import { RgUpsellPanel, RgUpsellConnect } from '../../src/donate/components';
import { CustomerPanel, CustomerConnect } from '../../src/donate/components';
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
      component: RgUpsellPanel,
      connect: RgUpsellConnect,
      settings: {
        tabName: 'Amount',
        title: 'Become A Regular Supporter',
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
    {
      component: PaymentPanel,
      connect: PaymentConnect,
      settings: {
        tabName: 'Payment',
        hideHeader: true,
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
      showStepIndicator: true,
      reCaptchaKey: 'dev',

      // oxfam
      storeUid: 'str_2817',
      singleOfferId: '8',
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
