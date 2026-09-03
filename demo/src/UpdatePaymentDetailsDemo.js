import React from 'react';
import { UpdatePaymentDetailsWidget, renderWidget } from '../../src/';
import { initTranslations } from '../../src/shared/translations';
import { SelectRecurrencePanel, SelectRecurrenceConnect } from '../../src/update-payment-details/components';
import { PaymentDetailsPanel, PaymentDetailsConnect } from '../../src/update-payment-details/components';
import { SuccessPanel, SuccessConnect } from '../../src/update-payment-details/components';

window.renderUpdatePaymentDetailsWidget = async (props) => {
  await initTranslations({
    translationsPath: 'translations/{{lng}}.json',
    defaultLanguage: 'en',
  });

  UpdatePaymentDetailsWidget.init();

  UpdatePaymentDetailsWidget.setPanels([
    {
      component: SelectRecurrencePanel,
      connect: SelectRecurrenceConnect,
      settings: {

      },
    },
    {
      component: PaymentDetailsPanel,
      connect: PaymentDetailsConnect,
      settings: {

      },
    },
    {
      component: SuccessPanel,
      connect: SuccessConnect,
      settings: {

      },
    },
  ]);

  renderWidget(props.elementId, <UpdatePaymentDetailsWidget {...props} />);
};

export default class UpdatePaymentDetailsDemo extends React.Component {
  componentDidMount() {
    window.renderUpdatePaymentDetailsWidget({
      elementId: 'update-payment-details-widget-demo',
      reCaptchaKey: '1234',
      
      // baseline
      actionKey: '37f6b34b00b611f18692',
    });
  }

  render() {
    return (
      <div className="container my-5">
        <div className="row">
    
          <div className="col-lg-6">
            <h2 style={headingStyle}>
              Update Payment Details.
            </h2>
            <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
            <p className="lead">Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </div>

          <div className="col-lg-6">
            <div id="update-payment-details-widget-demo"></div>
          </div>
    
        </div>
      </div>
    );
  }
}

const headingStyle = {
  fontWeight: "400",
  fontSize: "50px",
  marginBottom: "1rem",
};
