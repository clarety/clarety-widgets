import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { BasePanel, TextInput, PureCheckboxInput, StateInput, Button } from 'checkout/components';
import { FormContext } from 'checkout/utils';

export class AddressPanel extends BasePanel {
  onPressContinue = async event => {
    event.preventDefault();

    const { invalidatePanel, setFormData } = this.props;
    const { createOrUpdateCustomer, nextPanel } = this.props;

    if (this.validate()) {
      const formData = { ...this.state.formData };
      formData['sale.shippingOption'] = undefined;
      
      if (this.state.billingIsSameAsShipping) {
        formData['customer.billing.address1'] = formData['customer.delivery.address1'];
        formData['customer.billing.address2'] = formData['customer.delivery.address2'];
        formData['customer.billing.suburb']   = formData['customer.delivery.suburb'];
        formData['customer.billing.state']    = formData['customer.delivery.state'];
        formData['customer.billing.postcode'] = formData['customer.delivery.postcode'];
      }
      setFormData(formData);
      
      invalidatePanel({ component: 'ShippingPanel' });

      const didCreateOrUpdate = await createOrUpdateCustomer();
      if (!didCreateOrUpdate) return;

      nextPanel();
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

    this.setState({ errors });
    return errors.length === 0;
  }

  onChangeBillingIsSameAsShipping = (field, isChecked) => {
    this.setState({ billingIsSameAsShipping: isChecked });
  }

  componentDidMount() {
    const { customer } = this.props;

    if (customer) this.prefillCustomerData(customer);
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerData(this.props.customer);
    }

    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  prefillCustomerData(customer) {
    if (!customer) return;

    const formData = {};

    if (customer.delivery) {
      formData['customer.delivery.address1'] = customer.delivery.address1;
      formData['customer.delivery.address2'] = customer.delivery.address2;
      formData['customer.delivery.suburb']   = customer.delivery.suburb;
      formData['customer.delivery.state']    = customer.delivery.state;
      formData['customer.delivery.postcode'] = customer.delivery.postcode;
    }

    if (customer.billing) {
      formData['customer.billing.address1'] = customer.billing.address1;
      formData['customer.billing.address2'] = customer.billing.address2;
      formData['customer.billing.suburb']   = customer.billing.suburb;
      formData['customer.billing.state']    = customer.billing.state;
      formData['customer.billing.postcode'] = customer.billing.postcode;
    }

    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        ...formData,
      },
    }));
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Shipping Details"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index } = this.props;
    const { billingIsSameAsShipping } = this.state;

    return (
      <PanelContainer layout={layout}>
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Shipping Details"
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
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
              
              <div className="panel-actions">
                <Button title="Continue" type="submit" isBusy={isBusy} />
              </div>
            </Form>
          </FormContext.Provider>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderAddressForm(title, fieldPrefix) {
    const { settings } = this.props;

    switch (settings.addressType) {
      case 'international': return this.renderInternationalAddressForm(title, fieldPrefix);
      case 'australia':     return this.renderAustralianAddressForm(title, fieldPrefix);
      default:              return this.renderAustralianAddressForm(title, fieldPrefix);
    }
  }

  renderInternationalAddressForm(title, fieldPrefix) {
    return (
      <React.Fragment>
        <h5>{title}</h5>
        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.address1`} placeholder="Address 1 *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.address2`} placeholder="Address 2" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.suburb`} placeholder="Suburb *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.state`} placeholder="City *" />
          </Col>
          <Col>
            <TextInput field={`${fieldPrefix}.postcode`} placeholder="Postcode *" type="number" />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderAustralianAddressForm(title, fieldPrefix) {
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
            <TextInput field={`${fieldPrefix}.address2`} placeholder="Address 2" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.suburb`} placeholder="Suburb *" />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <StateInput field={`${fieldPrefix}.state`} placeholder="State *" />
          </Col>
          <Col>
            <TextInput field={`${fieldPrefix}.postcode`} placeholder="Postcode *" type="number" />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderDone() {
    const { formData } = this.state;
    const { layout, index } = this.props;
    const address = formData['customer.delivery.address1'];
    const suburb = formData['customer.delivery.suburb'];

    const title = `${address}, ${suburb}`;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
