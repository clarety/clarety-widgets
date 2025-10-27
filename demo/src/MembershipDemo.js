import React from 'react';
import { MembershipWidget, renderWidget } from '../../src/';
import { initTranslations } from '../../src/shared/translations';
import { MembershipPanel, MembershipConnect } from '../../src/membership/components';
import { DonationPanel, DonationConnect } from '../../src/donate/components';
import { CustomerPanel, CustomerConnect } from '../../src/donate/components';
import { PaymentPanel } from '../../src/shared/components';
import { PaymentConnect } from '../../src/membership/components';
import { SuccessPanel, SuccessConnect } from '../../src/donate/components';
import './styles/membership.css';

function getCoverFeesAmount(donationAmount) {
  return donationAmount * 0.05;
}

window.renderMembershipWidget = async (props) => {
  await initTranslations({
    translationsPath: 'translations/{{lng}}.json',
    defaultLanguage: 'en',
  });

  MembershipWidget.init();

  MembershipWidget.setPanels([
    {
      component: MembershipPanel,
      connect: MembershipConnect,
      settings: {
        tabName: 'Membership',
      },
    },
    {
      component: DonationPanel,
      connect: DonationConnect,
      settings: {
        tabName: 'Amount',
        hideHeader: true,
        showFrequencySelect: false,
        priceHandleStyle: 'price-only',
        allowNone: true,
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
        // hideStartDate: true,
        submitBtnText: 'Join Now',
        calcFeesFn: getCoverFeesAmount,
      },
    },
    {
      component: SuccessPanel,
      connect: SuccessConnect,
      settings: {
        hideTab: true,
        title: 'Thanks for Joining!',
      },
    },
  ]);

  renderWidget(props.elementId, <MembershipWidget layout="tabs" {...props} />);
};

export default class MembershipDemo extends React.Component {
  componentDidMount() {
    window.renderMembershipWidget({
      elementId: 'membership-widget-demo',

      // ihc
      storeUid: 'str_wey5',
      // membershipOfferId: '23',
      categoryUid: 'ctg_37q4',

      sourceId: '17',
      responseId: 'e9c2e351d90b11e996fd',
      emailResponseId: '1234',
    });
  }

  render() {
    return (
      <div className="container my-5">
        <div className="row">
    
          <div className="col-lg-6">
            <h2 style={headingStyle}>
              Join now. <span className="text-muted">Human Fund needs your help.</span>
            </h2>
            <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
            <p className="lead">Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </div>

          <div className="col-lg-6">
            <div id="membership-widget-demo"></div>
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
