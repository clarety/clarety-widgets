import React from 'react';
import { Form, Col, Alert } from 'react-bootstrap';
import { t } from 'shared/translations';
import { PanelContainer, PanelHeader, PanelBody, AddressFinder } from 'shared/components';
import { FormContext, getSuburbLabel, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { BasePanel, TextInput, PureCheckboxInput, StateInput, CountryInput, PostcodeInput, FormElement, Button } from 'checkout/components';

export class AddressPanel extends BasePanel {
  shouldUseAddressFinder(addressType) {
    const { addressFinderKey, addressFinderCountry, defaultCountry } = this.props;
    const { formData } = this.state;

    if (addressFinderCountry) {
      if (formData[`customer.${addressType}.country`] !== addressFinderCountry) {
        return false;
      }
    }

    return addressFinderKey && defaultCountry;
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
        'customer.billing.metadata': address.metadata,

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
        'customer.delivery.metadata': address.metadata,

      });
    }
  };

  onPressDisableAddressFinder = (addressType) => {
    if (addressType === 'billing')  this.setState({ disableBillingAddressFinder:  true });
    if (addressType === 'delivery') this.setState({ disableDeliveryAddressFinder: true });
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
        formData['customer.billing.dpid']     = formData['customer.delivery.dpid'];
        formData['customer.billing.metadata']     = formData['customer.delivery.metadata'];

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
      this.validateAddress('delivery', errors);
    }    

    if (!this.state.billingIsSameAsShipping) {
      this.validateAddress('billing', errors);
    }

    this.setState({ errors });
    return errors.length === 0;
  }

  validateAddress(addressType, errors) {
    let country = this.state.formData[`customer.${addressType}.country`];

    this.validateRequired(`customer.${addressType}.address1`, errors, t('address-1', 'Address 1') + ' ' + t('is-required', 'is required'));

    if (country !== 'NZ') {
      this.validateRequired(`customer.${addressType}.suburb`, errors, getSuburbLabel(country) + ' ' + t('is-required', 'is required'));
    }
    
    this.validateRequired(`customer.${addressType}.state`, errors, getStateLabel(country) + ' ' + t('is-required', 'is required'));
    this.validateRequired(`customer.${addressType}.postcode`, errors, getPostcodeLabel(country) + ' ' + t('is-required', 'is required'));
    this.validateRequired(`customer.${addressType}.country`, errors, t('country', 'Country') + ' ' + t('is-required', 'is required'));
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
    const title = shippingRequired
      ? t('shipping-details', 'Shipping Details')
      : t('billing-details', 'Billing Details');

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
    const title = shippingRequired
      ? t('shipping-details', 'Shipping Details')
      : t('billing-details', 'Billing Details');

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
              {this.renderErrors()}
              {this.renderFields()}
              {this.renderActions()}
            </Form>
          </FormContext.Provider>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderErrors() {
    // Only render errors when using AddressFinder.
    if (!this.shouldUseAddressFinder()) return null;
    if (!this.state.errors.length) return null;
    
    return (
      <Alert variant="danger" className="error-messages">
        <ul className="list-unstyled">
          {this.state.errors.map((error, index) =>
            <li
              key={index}
              dangerouslySetInnerHTML={{ __html: error.message }}
            />
          )}
        </ul>
      </Alert>
    );
  }

  renderFields() {
    const { billingIsSameAsShipping } = this.state;

    if (this.props.shippingRequired) {
      return (
        <React.Fragment>
          {this.renderAddressFields(t('shipping-address', 'Shipping Address'), 'delivery')}
          {this.renderBillingIsSameAsShippingCheckbox()}
          {!billingIsSameAsShipping && this.renderAddressFields(t('billing-address', 'Billing Address'), 'billing')}
        </React.Fragment>
      );
    } else {
      return this.renderAddressFields(t('billing-address', 'Billing Address'), 'billing');
    }
  }

  renderBillingIsSameAsShippingCheckbox() {
    const { billingIsSameAsShipping } = this.state;

    return (
      <Form.Row>
        <Col>
          <PureCheckboxInput
            field="billingIsSameAsShipping"
            label={t('billing-same-as-shipping', 'Billing Address is the same as Shipping Address')}
            checked={billingIsSameAsShipping || false}
            onChange={this.onChangeBillingIsSameAsShipping}
          />
        </Col>
      </Form.Row>
    );
  }

  renderAddressFields(title, addressType) {
    const disableAddressFinder = addressType === 'billing'
      ? this.state.disableBillingAddressFinder
      : this.state.disableDeliveryAddressFinder;

    if (this.shouldUseAddressFinder(addressType) && !disableAddressFinder) {
      return this.renderAddressFinderInput(title, addressType);
    }

    return this.renderStandardAddressInputs(title, addressType);
  }

  renderStandardAddressInputs(title, addressType) {
    const { settings } = this.props;
    const country = this.state.formData[`customer.${addressType}.country`];

    return (
      <React.Fragment>
        <h5>{title}</h5>

        {this.renderCountryField(addressType)}

        <Form.Row>
          <Col>
            <TextInput
              field={`customer.${addressType}.address1`}
              label={settings.address1Label || t('address-1', 'Address 1')}
              hideLabel={settings.hideLabels}
              required
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput
              field={`customer.${addressType}.address2`}
              label={settings.address2Label || t('address-2', 'Address 2')}
              hideLabel={settings.hideLabels}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <TextInput
              field={`customer.${addressType}.suburb`}
              label={getSuburbLabel(country)}
              hideLabel={settings.hideLabels}
              required
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <StateInput
              field={`customer.${addressType}.state`}
              label={getStateLabel(country)}
              country={country}
              hideLabel={settings.hideLabels}
              required
            />
          </Col>

          <Col>
            <PostcodeInput
              field={`customer.${addressType}.postcode`}
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

  renderCountryField(addressType) {
    const { settings, defaultCountry } = this.props;

    if (!settings.showCountry) {
      return (
        <FormElement field={`customer.${addressType}.country`} value={defaultCountry} />
      );
    }

    return (
      <Form.Row>
        <Col>
          <CountryInput
            field={`customer.${addressType}.country`}
            label={t('country', 'Country')}
            initialValue={defaultCountry}
            region={settings.region}
            hideLabel={settings.hideLabels}
            required
          />
        </Col>
      </Form.Row>
    );
  }

  renderAddressFinderInput(title, addressType) {
    return (
      <React.Fragment>
        <h5>{title}</h5>

        {this.renderCountryField(addressType)}

        <Form.Row>
          <Col>
            <Form.Group>
              <AddressFinder
                id={`${addressType}-address-finder-input`}
                defaultValue={this.getInitialAddress(addressType)}
                apiKey={this.props.addressFinderKey}
                country={this.props.defaultCountry}
                onSelect={(address) => this.onAddressFinderSelect(addressType, address)}
              />

              <Button
                variant="link"
                onClick={() => this.onPressDisableAddressFinder(addressType)}
                title={t('cant-find-your-address', "Can't find your address?")}
              />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderActions() {
    return (
      <div className="panel-actions">
        <Button title={t('continue', 'Continue')} type="submit" isBusy={this.props.isBusy} />
      </div>
    );
  }

  renderDone() {
    const { layout, index, shippingRequired, customer } = this.props;

    const address = shippingRequired ? customer.delivery : customer.billing;
    const title = this.getFormattedAddress(address);

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

  getInitialAddress(addressType) {
    const { customer } = this.props;
    if (!customer) return undefined;

    switch (addressType) {
      case 'billing':  return this.getFormattedAddress(customer.billing);
      case 'delivery': return this.getFormattedAddress(customer.delivery);
      default:         return undefined;
    }
  }

  getFormattedAddress(address) {
    if (!address) return undefined;

    const { address1, address2, suburb, state, postcode } = address;
    if (!address1 || !state || !postcode) return undefined;

    return address1
         + (address2 ? ', ' + address2 : '')
         + (suburb   ? ', ' + suburb   : '')
         + ', ' + state
         + ' '  + postcode;
  }
}
