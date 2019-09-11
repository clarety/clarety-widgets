import React from 'react';
import { createDonateWidget } from '../../src/';
import { Actions } from '../../src/donate/actions';
import { Validations } from '../../src/donate/validations';
import '../../src/donate/style.scss';


class InstanceValidations extends Validations {
  validateAmountPanel(errors, getState) {
    super.validateAmountPanel(errors, getState);

    const { formData } = getState();

    if (!this.validateEmail(formData['customer.email'])) {
      errors.push({
        message: 'Please enter a valid email.',
        field: 'customer.email',
      });
    }

    return errors.length === 0;
  }
}


const DonateWidget = createDonateWidget({
  actions: new Actions(),
  validations: new Validations(),
  components:  {
    // eg:
    // AmountPanel: InstanceAmountPanel,
  },
});


const DonateDemo = () => (
  <div className="container my-5">
    <div className="row">

      <div className="col-lg-6">
        <h2 style={headingStyle}>
          Donate now. <span className="text-muted">Human Fund needs your help.</span>
        </h2>
        <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
        <p className="lead">Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      </div>

      <div className="donate-widget col-lg-6">
        <DonateWidget
          storeCode="AU"
          singleOfferCode="widget-single"
          recurringOfferCode="widget-recurring"
          forceMdLayout
        />
      </div>

    </div>
  </div>
);

export default DonateDemo;

const headingStyle = {
  fontWeight: "400",
  fontSize: "50px",
  margin: "7rem 0 2rem",
};
