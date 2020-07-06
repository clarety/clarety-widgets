import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Form } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FormContext, getStateLabel, getPostcodeLabel, requiredField, phoneNumberField, parseNestedElements } from 'shared/utils';
import { Button } from 'form/components';
import { MerchItem, MerchQtysModal } from 'registration/components';
import { TextInput, PhoneInput, StateInput, PostcodeInput, CountryInput } from 'registration/components';

export class MerchPanel extends BasePanel {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      errors: [],
      onChange: this.onFormChange,

      selectedItem: null,
      qtys: {},
    };
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (this.props.customer !== prevProps.customer) {
      this.prefillCustomerFormData(this.props.customer);
    }
  }

  reset() {
    this.setState({
      errors: [],
      qtys: {},
    });
  }

  onClickNext = async (event) => {
    event.preventDefault();

    const { addMerchToCart, updateCustomer, nextPanel } = this.props;

    if (this.validate()) {
      if (this.hasAddedMerch()) {
        addMerchToCart(this.state.qtys);

        const { customer } = parseNestedElements(this.state.formData);
        updateCustomer(customer);
      }

      nextPanel();
    }
  };

  onClickEdit = (event) => {
    event.preventDefault();
    this.props.removeItemsWithType('merchandise');
    this.props.editPanel();
  };

  onFormChange = (field, value) => {
    this.setState(prevState => ({
      formData: { ...prevState.formData, [field]: value },
      errors: prevState.errors.filter(error => error.field !== field),
    }));
  };

  onSelectMerchItem = (merchItem) => {
    this.setState({ selectedItem: merchItem });
  };

  onChangeQty = (offerId, productId, value) => {
    this.setState(prevState => {
      const qty = productId
        ? { ...prevState.qtys[offerId], [productId]: value }
        : value;

      return {
        qtys: { ...prevState.qtys, [offerId]: qty }
      };
    });
  }

  onCloseQtysModal = () => {
    this.setState({ selectedItem: null });
  };

  prefillCustomerFormData(customer) {
    const formData = {
      'customer.mobile': customer.mobile,
    };

    if (customer.delivery) {
      formData['customer.delivery.address1'] = customer.delivery.address1;
      formData['customer.delivery.address2'] = customer.delivery.address2;
      formData['customer.delivery.suburb']   = customer.delivery.suburb;
      formData['customer.delivery.state']    = customer.delivery.state;
      formData['customer.delivery.postcode'] = customer.delivery.postcode;
      formData['customer.delivery.country']  = customer.delivery.country;
    }

    this.setState({ formData });
  }

  hasAddedMerch() {
    for (const [offerId, offerQty] of Object.entries(this.state.qtys)) {
      if (typeof offerQty === 'number' && offerQty > 0) {
        return true;
      }

      if (typeof offerQty === 'object') {
        for (const [productId, productQty] of Object.entries(offerQty)) {
          if (typeof productQty === 'number' && productQty > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.setState({ errors });
    return errors.length === 0;
  }

  validateFields(errors) {
    const { formData } = this.state;

    if (this.hasAddedMerch()) {
      phoneNumberField(errors, formData, 'customer.mobile');
      requiredField(errors, formData, 'customer.delivery.address1');
      requiredField(errors, formData, 'customer.delivery.suburb');
      requiredField(errors, formData, 'customer.delivery.state');
      requiredField(errors, formData, 'customer.delivery.postcode');
      requiredField(errors, formData, 'customer.delivery.country');
    }
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="merch-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Merchandise"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }
  
  renderEdit() {
    const { layout, index, isBusy, settings, merchandise } = this.props;
    const { selectedItem, qtys } = this.state;

    return (
      <PanelContainer layout={layout} status="edit" className="merch-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Check Out Our Official Merchandise"
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>

          <Row className="merch-items">
            {merchandise.map(item =>
              <Col key={item.offerId} xs={12} md={6} xl={4}>
                <MerchItem
                  key={item.offerId}
                  merchItem={item}
                  qtys={qtys[item.offerId]}
                  onShowQtys={this.onSelectMerchItem}
                  onChangeQty={this.onChangeQty}
                />
              </Col>
            )}
          </Row>

          {this.renderAddressFields()}

          <div className="panel-actions">
            <Button onClick={this.onClickNext} isBusy={isBusy}>
              <FormattedMessage id="btn.next" />
            </Button>
          </div>

        </PanelBody>

        <MerchQtysModal
          merchItem={selectedItem}
          qtys={selectedItem ? qtys[selectedItem.offerId] : null}
          onClickClose={this.onCloseQtysModal}
          onChangeQty={this.onChangeQty}
        />
      </PanelContainer>
    );
  }

  renderAddressFields() {
    if (!this.hasAddedMerch()) return null;

    const country = this.state.formData['customer.delivery.country'];

    return (
      <FormContext.Provider value={this.state}>
        <div className="delivery-address">
          <h2>Delivery Details</h2>

          <Form.Row>
            <Col>
              <CountryInput field="customer.delivery.country" label="Country" required />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <PhoneInput
                field="customer.mobile"
                label={<FormattedMessage id="label.customer.mobile" defaultMessage="Mobile" />}
                country={country}
                required
              />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput
                field="customer.delivery.address1"
                label={<FormattedMessage id="label.customer.delivery.address1" defaultMessage="Address 1" />}
                required
              />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput
                field="customer.delivery.address2"
                label={<FormattedMessage id="label.customer.delivery.address2" defaultMessage="Address 2" />}
              />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <TextInput
                field="customer.delivery.suburb"
                label={<FormattedMessage id="label.customer.delivery.suburb" defaultMessage="Suburb" />}
                required
              />
            </Col>
          </Form.Row>

          <Form.Row>
            <Col>
              <StateInput field="customer.delivery.state" label={getStateLabel(country)} country={country} required />
            </Col>
            <Col>
              <PostcodeInput field="customer.delivery.postcode" label={getPostcodeLabel(country)} required />
            </Col>
          </Form.Row>
        </div>
      </FormContext.Provider>
    );
  }

  renderDone() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="merch-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title="Merchandise"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          {/* TODO: what content goes here?? */}
          <p>Check out our offical merchandise</p>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>
          
        </PanelBody>
      </PanelContainer>
    );
  }
}
