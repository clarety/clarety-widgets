import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { RxBasePanel, RxTextInput, PureCheckboxInput, RxStateInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, updateFormData, onSubmitShippingDetails, editPanel, invalidatePanel, panels, setErrors } from 'checkout/actions';

class _ShippingDetailsPanel extends RxBasePanel {
  onPressContinue = event => {
    const { invalidatePanel, updateFormData, onSubmitShippingDetails } = this.props;

    event.preventDefault();

    if (this.validate()) {
      const formData = {
        'sale.shippingOption': undefined,
      };
      
      if (this.state.billingIsSameAsShipping) {
        formData['customer.billing.address1'] = this.props.formData['customer.delivery.address1'];
        formData['customer.billing.suburb']   = this.props.formData['customer.delivery.suburb'];
        formData['customer.billing.state']    = this.props.formData['customer.delivery.state'];
        formData['customer.billing.postcode'] = this.props.formData['customer.delivery.postcode'];
      }
      
      updateFormData(formData);
      invalidatePanel(panels.shippingOptionsPanel);
      onSubmitShippingDetails();
    }
  };

  validate() {
    const errors = [];

    this.validateRequired('customer.delivery.address1', errors);
    this.validateRequired('customer.delivery.suburb', errors);
    this.validateRequired('customer.delivery.state', errors);
    this.validateRequired('customer.delivery.postcode', errors);

    if (!this.state.billingIsSameAsShipping) {
      this.validateRequired('customer.billing.address1', errors);
      this.validateRequired('customer.billing.suburb', errors);
      this.validateRequired('customer.billing.state', errors);
      this.validateRequired('customer.billing.postcode', errors);
    }

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  onChangeBillingIsSameAsShipping = (field, isChecked) => {
    this.setState({ billingIsSameAsShipping: isChecked });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }

    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  // TODO: shouldn't need to do this in the component...
  prefillCustomerData(customer) {
    if (!customer) return;

    this.setState({
      formData: {
        'customer.delivery.address1': customer.delivery.address1,
        'customer.delivery.suburb':   customer.delivery.suburb,
        'customer.delivery.state':    customer.delivery.state,
        'customer.delivery.postcode': customer.delivery.postcode,

        'customer.billing.address1':  customer.billing.address1,
        'customer.billing.suburb':    customer.billing.suburb,
        'customer.billing.state':     customer.billing.state,
        'customer.billing.postcode':  customer.billing.postcode,
      }
    });
  }

  renderWait() {
    return (
      <WaitPanelHeader number="3" title="Shipping Details" />
    );
  }

  renderEdit() {
    const { isBusy } = this.props;
    const { billingIsSameAsShipping } = this.state;

    return (
      <div className="panel">
        <EditPanelHeader number="3" title="Shipping Details" />
        
        <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
          <Form onSubmit={this.onPressContinue}>
            {this.renderAddressForm('Shipping Address', 'customer.delivery')}

            <Form.Row>
              <Col>
                <PureCheckboxInput
                  field="billingIsSameAsShipping"
                  label="Billing Address is the same as Shipping Address"
                  checked={billingIsSameAsShipping || false}
                  onChange={this.onChangeBillingIsSameAsShipping}
                />
              </Col>
            </Form.Row>

            {!billingIsSameAsShipping && this.renderAddressForm('Billing Address', 'customer.billing')}
            
            <div className="text-right mt-3">
              <Button title="Continue" type="submit" isBusy={isBusy} />
            </div>
          </Form>
        </BlockUi>
      </div>
    );
  }

  renderAddressForm(title, fieldPrefix) {
    return (
      <React.Fragment>
        <h5>{title}</h5>
        <Form.Row>
          <Col>
            <RxTextInput field={`${fieldPrefix}.address1`} placeholder="Address *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <RxTextInput field={`${fieldPrefix}.suburb`} placeholder="Suburb *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <RxStateInput field={`${fieldPrefix}.state`} placeholder="State *" />
          </Col>
          <Col>
            <RxTextInput field={`${fieldPrefix}.postcode`} placeholder="Postcode *" type="number" />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderDone() {
    const { formData } = this.props;
    const address = formData['customer.delivery.address1'];
    const suburb = formData['customer.delivery.suburb'];

    const title = `${address}, ${suburb}`;

    return (
      <DonePanelHeader
        number="3"
        title={title}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busy,
    customer: state.cart.customer,
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  updateFormData: updateFormData,
  onSubmitShippingDetails: onSubmitShippingDetails,
  invalidatePanel: invalidatePanel,
  editPanel: editPanel,
  setErrors: setErrors,
};

export const ShippingDetailsPanel = connect(mapStateToProps, actions)(_ShippingDetailsPanel);
