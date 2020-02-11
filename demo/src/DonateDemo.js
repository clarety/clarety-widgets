import React from 'react';
import { DonateWidget, renderWidget } from '../../src/';
import { DonationPanel, DonationConnect } from '../../src/donate/components';
import { CustomerPanel, CustomerConnect } from '../../src/donate/components';
import { PaymentPanel, PaymentConnect } from '../../src/donate/components';
import { SuccessPanel, SuccessConnect } from '../../src/donate/components';
import '../../src/donate/style.scss';

window.renderDonateWidget = (props) => {
  DonateWidget.init();

  DonateWidget.setPanels([
    {
      component: DonationPanel,
      connect: DonationConnect,
      settings: {
        tabName: 'Amount',
        hideHeader: true,
      },
    },
    {
      component: CustomerPanel,
      connect: CustomerConnect,
      settings: {
        tabName: 'Details',
        hideHeader: true,
      },
    },
    {
      component: PaymentPanel,
      connect: PaymentConnect,
      settings: {
        tabName: 'Payment',
      },
    },
    {
      component: SuccessPanel,
      connect: SuccessConnect,
      settings: {
        hideTab: true,
      },
    },
  ]);

  renderWidget(props.elementId, <DonateWidget {...props} />);
};

export default class DonateDemo extends React.Component {
  componentDidMount() {
    window.renderDonateWidget({
      elementId: 'donate-widget-demo',

      storeCode: 'AU',
      singleOfferId: '8',
      recurringOfferId: '17',

      sourceId: '17',
      responseId: 'e9c2e351d90b11e996fd',
      emailResponseId: '1234',
      
      // reCaptchaKey: '1234',

      showStepIndicator: true,
      forceMdLayout: true,
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
