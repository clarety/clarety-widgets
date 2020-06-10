import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { BasePanel, TextInput, PureCheckboxInput, StateInput, CountryInput, PostcodeInput, FormElement, Button } from 'checkout/components';

export class AddressPanel extends BasePanel {
  onPressContinue = async event => {
    event.preventDefault();

    const { invalidatePanel, setFormData } = this.props;
    const { createOrUpdateCustomer, nextPanel } = this.props;

    if (this.validate()) {
      const formData = { ...this.state.formData };
      formData['sale.shippingUid'] = undefined;
      
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
              {this.renderAddressFields('Shipping Address', 'customer.delivery')}

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

              {!billingIsSameAsShipping && this.renderAddressFields('Billing Address', 'customer.billing')}
              
              <div className="panel-actions">
                <Button title="Continue" type="submit" isBusy={isBusy} />
              </div>
            </Form>
          </FormContext.Provider>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderAddressFields(title, fieldPrefix) {
    const { settings } = this.props;

    const country = this.state.formData[`${fieldPrefix}.country`];

    return (
      <React.Fragment>
        <h5>{title}</h5>

        {this.renderCountryField(fieldPrefix)}

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.address1`} label="Address 1" required hideLabel={settings.hideLabels} />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.address2`} label="Address 2" hideLabel={settings.hideLabels} />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput field={`${fieldPrefix}.suburb`} label="Suburb" required hideLabel={settings.hideLabels} />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <StateInput field={`${fieldPrefix}.state`} label={getStateLabel(country)} country={country} required hideLabel={settings.hideLabels} />
          </Col>

          <Col>
            <PostcodeInput field={`${fieldPrefix}.postcode`} label={getPostcodeLabel(country)} country={country} required hideLabel={settings.hideLabels} />
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderCountryField(fieldPrefix) {
    const { settings, defaultCountry } = this.props;

    if (!settings.showCountry) {
      return (
        <FormElement field={`${fieldPrefix}.country`} value={defaultCountry} />
      );
    }

    return (
      <Form.Row>
        <Col>
          <CountryInput field={`${fieldPrefix}.country`} label="Country" initialValue={defaultCountry} required hideLabel={settings.hideLabels} />
        </Col>
      </Form.Row>
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
