import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext, getSuburbLabel, getStateLabel, getPostcodeLabel, setupAddressFinder } from 'shared/utils';
import { BasePanel, TextInput, PureCheckboxInput, StateInput, CountryInput, PostcodeInput, FormElement, Button } from 'checkout/components';

export class AddressPanel extends BasePanel {
  billingAddressFinder = null;
  deliveryAddressFinder = null;

  onShowPanel() {
    if (this.shouldUseAddressFinder()) {
      // Billing address finder.
      setupAddressFinder({
        elementId: 'customer.billing-address-finder-input',
        apiKey: this.props.addressFinderKey,
        country: this.props.defaultCountry,
        onLoad: (addressFinder) => this.billingAddressFinder = addressFinder,
        onSelect: (address) => this.onAddressFinderSelect('billing', address),
      });

      if (this.props.shippingRequired) {
        // Delivery address finder.
        setupAddressFinder({
          elementId: 'customer.delivery-address-finder-input',
          apiKey: this.props.addressFinderKey,
          country: this.props.defaultCountry,
          onLoad: (addressFinder) => this.deliveryAddressFinder = addressFinder,
          onSelect: (address) => this.onAddressFinderSelect('delivery', address),
        });
      }
    }
  }

  shouldUseAddressFinder() {
    const { customer, addressFinderKey, defaultCountry } = this.props;
    return !customer.customerUid && addressFinderKey && defaultCountry;
  }

  componentWillUnmount() {
    if (this.billingAddressFinder) {
      this.billingAddressFinder.destroy();
      this.billingAddressFinder = null;
    }

    if (this.deliveryAddressFinder) {
      this.deliveryAddressFinder.destroy();
      this.deliveryAddressFinder = null;
    }
  }

  onAddressFinderSelect = (addressType, address) => {
    if (addressType === 'billing') {
      this.updateFormData({
        'customer.billing.address1': address.address1,
        'customer.billing.address2': address.address2,
        'customer.billing.suburb':   address.suburb,
        'customer.billing.state':    address.state,
        'customer.billing.postcode': address.postcode,
        'customer.billing.country':  address.country,
        'customer.billing.dpid':     address.dpid,
      });
    }

    if (addressType === 'delivery') {
      this.updateFormData({
        'customer.delivery.address1': address.address1,
        'customer.delivery.address2': address.address2,
        'customer.delivery.suburb':   address.suburb,
        'customer.delivery.state':    address.state,
        'customer.delivery.postcode': address.postcode,
        'customer.delivery.country':  address.country,
        'customer.delivery.dpid':     address.dpid,
      });
    }
  };

  onPressContinue = async (event) => {
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
        formData['customer.billing.country']  = formData['customer.delivery.country'];
        this.updateFormData(formData);
      }
      
      setFormData(formData);
      
      invalidatePanel({ component: 'ShippingPanel' });

      const didCreateOrUpdate = await createOrUpdateCustomer();
      if (!didCreateOrUpdate) return;

      nextPanel();
    }
  };

  validate() {
    const { shippingRequired } = this.props;
    const errors = [];

    if (shippingRequired) {
      this.validateRequired('customer.delivery.address1', errors);
      this.validateRequired('customer.delivery.suburb', errors);
      this.validateRequired('customer.delivery.state', errors);
      this.validateRequired('customer.delivery.postcode', errors);
      this.validateRequired('customer.delivery.country', errors);
    }

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

    this.clearStateOnCountryChange(prevProps, prevState);
  }

  clearStateOnCountryChange(prevProps, prevState) {
    const formData = this.state.formData;
    const prevFormData = prevState.formData;

    const isNewDeliveryCountry = prevFormData['customer.delivery.country'] !== formData['customer.delivery.country'];
    const isNewDeliveryState   = prevFormData['customer.delivery.state']   !== formData['customer.delivery.state'];
    if (isNewDeliveryCountry && !isNewDeliveryState) {
      this.onChangeField('customer.delivery.state', undefined);
    }

    const isNewBillingCountry = prevFormData['customer.billing.country'] !== formData['customer.billing.country'];
    const isNewBillingState   = prevFormData['customer.billing.state']   !== formData['customer.billing.state'];
    if (isNewBillingCountry && !isNewBillingState) {
      this.onChangeField('customer.billing.state', undefined);
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
      formData['customer.delivery.country']  = customer.delivery.country;
    }

    if (customer.billing) {
      formData['customer.billing.address1'] = customer.billing.address1;
      formData['customer.billing.address2'] = customer.billing.address2;
      formData['customer.billing.suburb']   = customer.billing.suburb;
      formData['customer.billing.state']    = customer.billing.state;
      formData['customer.billing.postcode'] = customer.billing.postcode;
      formData['customer.billing.country']  = customer.billing.country;
    }

    this.updateFormData(formData);
  }

  renderWait() {
    const { layout, index, shippingRequired } = this.props;
    const title = shippingRequired ? 'Shipping Details' : 'Billing Details';

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={title}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index, shippingRequired } = this.props;
    const title = shippingRequired ? 'Shipping Details' : 'Billing Details';

    return (
      <PanelContainer layout={layout}>
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={title}
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <FormContext.Provider value={this.state}>
            <Form onSubmit={this.onPressContinue}>
              {this.renderFields()}

              <div className="panel-actions">
                <Button title="Continue" type="submit" isBusy={isBusy} />
              </div>
            </Form>
          </FormContext.Provider>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderFields() {
    const { billingIsSameAsShipping } = this.state;

    if (this.props.shippingRequired) {
      return (
        <React.Fragment>
          {this.renderAddressFields('Shipping Address', 'customer.delivery')}
          {this.renderBillingIsSameAsShippingCheckbox()}
          {!billingIsSameAsShipping && this.renderAddressFields('Billing Address', 'customer.billing')}
        </React.Fragment>
      );
    } else {
      return this.renderAddressFields('Billing Address', 'customer.billing');
    }
  }

  renderBillingIsSameAsShippingCheckbox() {
    const { billingIsSameAsShipping } = this.state;

    return (
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
    );
  }

  renderAddressFields(title, fieldPrefix) {
    const { settings } = this.props;

    if (this.shouldUseAddressFinder()) {
      return (
        <React.Fragment>
          <h5>{title}</h5>

          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Control id={`${fieldPrefix}-address-finder-input`} />
              </Form.Group>
            </Col>
          </Form.Row>
        </React.Fragment>
      );
    }

    const country = this.state.formData[`${fieldPrefix}.country`];

    return (
      <React.Fragment>
        <h5>{title}</h5>

        {this.renderCountryField(fieldPrefix)}

        <Form.Row>
          <Col>
            <TextInput
              field={`${fieldPrefix}.address1`}
              label={settings.address1Label || "Address 1"}
              hideLabel={settings.hideLabels}
              required
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput
              field={`${fieldPrefix}.address2`}
              label={settings.address2Label || "Address 2"}
              hideLabel={settings.hideLabels}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput
              field={`${fieldPrefix}.suburb`}
              label={getSuburbLabel(country)}
              hideLabel={settings.hideLabels}
              required
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <StateInput
              field={`${fieldPrefix}.state`}
              label={getStateLabel(country)}
              country={country}
              hideLabel={settings.hideLabels}
              required
            />
          </Col>

          <Col>
            <PostcodeInput
              field={`${fieldPrefix}.postcode`}
              label={getPostcodeLabel(country)}
              country={country}
              hideLabel={settings.hideLabels}
              required
            />
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
          <CountryInput
            field={`${fieldPrefix}.country`}
            label="Country"
            initialValue={defaultCountry}
            region={settings.region}
            hideLabel={settings.hideLabels}
            required
          />
        </Col>
      </Form.Row>
    );
  }

  renderDone() {
    const { formData } = this.state;
    const { layout, index, shippingRequired } = this.props;
    const addressKey = shippingRequired?'delivery':'billing';
    const address = formData['customer.'+addressKey+'.address1'];
    const suburb = formData['customer.'+addressKey+'.suburb'];
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
