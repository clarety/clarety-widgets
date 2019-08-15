import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, TextInput, PureCheckboxInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { updateFormData, updateCheckout, editPanel, resetShippingOptionsPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _ShippingDetailsPanel extends BasePanel {
  onPressContinue = event => {
    event.preventDefault();

    if (this.validate()) {
      const formData = {
        ...this.state.formData,
        shippingOption: undefined,
      };
      
      if (this.state.billingIsSameAsShipping) {
        formData['customer.billing.address1'] = formData['customer.delivery.address1'];
        formData['customer.billing.suburb']   = formData['customer.delivery.suburb'];
        formData['customer.billing.state']    = formData['customer.delivery.state'];
        formData['customer.billing.postcode'] = formData['customer.delivery.postcode'];
        formData['customer.billing.country']  = formData['customer.delivery.country'];
      }

      this.props.updateFormData(formData);
      this.props.updateCheckout();
      this.props.resetShippingOptionsPanel();
    }
  };

  validate() {
    const errors = [];

    this.validateRequired('customer.delivery.address1', errors);
    this.validateRequired('customer.delivery.suburb', errors);
    this.validateRequired('customer.delivery.state', errors);
    this.validateRequired('customer.delivery.postcode', errors);
    this.validateRequired('customer.delivery.country', errors);

    if (!this.state.billingIsSameAsShipping) {
      this.validateRequired('customer.billing.address1', errors);
      this.validateRequired('customer.billing.suburb', errors);
      this.validateRequired('customer.billing.state', errors);
      this.validateRequired('customer.billing.postcode', errors);
      this.validateRequired('customer.billing.country', errors);
    }

    this.setState({ errors });
    return errors.length === 0;
  }

  onChangeBillingIsSameAsShipping = (field, isChecked) => {
    this.setState({ billingIsSameAsShipping: isChecked });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }
  }

  prefillCustomerData(customer) {
    if (!customer) return;

    this.setState({
      formData: {
        'customer.delivery.address1': customer.delivery.address1,
        'customer.delivery.suburb':   customer.delivery.suburb,
        'customer.delivery.state':    customer.delivery.state,
        'customer.delivery.postcode': customer.delivery.postcode,
        'customer.delivery.country':  customer.delivery.country,

        'customer.billing.address1':  customer.billing.address1,
        'customer.billing.suburb':    customer.billing.suburb,
        'customer.billing.state':     customer.billing.state,
        'customer.billing.postcode':  customer.billing.postcode,
        'customer.billing.country':   customer.billing.country,
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
        
        <FormContext.Provider value={this.state}>
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
        </FormContext.Provider>
      </div>
    );
  }

  renderAddressForm(title, fieldPrefix) {
    return (
      <React.Fragment>
        <h5>{title}</h5>
        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.address1`} placeholder="Address *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.suburb`} placeholder="Suburb *" />
          </Col>
          <Col>
            <TextInput field={`${fieldPrefix}.state`} placeholder="State *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.postcode`} placeholder="Postcode *" />
          </Col>
          <Col>
            <TextInput field={`${fieldPrefix}.country`} placeholder="Country *" />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderDone() {
    const { formData } = this.state;
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
    isBusy: state.checkout.isBusy,
    customer: state.login.customer,
  };
};

const actions = {
  updateFormData: updateFormData,
  updateCheckout: updateCheckout,
  resetShippingOptionsPanel: resetShippingOptionsPanel,
  editPanel: editPanel,
};

export const ShippingDetailsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ShippingDetailsPanel);
