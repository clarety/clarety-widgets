import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { BasePanel, TextInput, CheckboxInput, StateInput, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, onSubmitShippingDetails, editPanel, validateShippingDetails } from 'checkout/actions';

class _ShippingDetailsPanel extends BasePanel {
  onPressContinue = event => {
    event.preventDefault();

    const { validate, onSubmitShippingDetails } = this.props;
    validate({ onSuccess: onSubmitShippingDetails });
  };

  renderWait() {
    return (
      <WaitPanelHeader number="3" title="Shipping Details" />
    );
  }

  renderEdit() {
    const { isBusy, formData } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number="3" title="Shipping Details" />
        
        <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
          <Form onSubmit={this.onPressContinue}>
            {this.renderAddressForm('Shipping Address', 'customer.delivery')}

            <Form.Row>
              <Col>
                <CheckboxInput
                  field="billingIsSameAsShipping"
                  label="Billing Address is the same as Shipping Address"
                />
              </Col>
            </Form.Row>

            {!formData['billingIsSameAsShipping'] && this.renderAddressForm('Billing Address', 'customer.billing')}
            
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
            <TextInput field={`${fieldPrefix}.address1`} placeholder="Address *" />
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
  onSubmitShippingDetails: onSubmitShippingDetails,
  editPanel: editPanel,
  validate: validateShippingDetails,
};

export const ShippingDetailsPanel = connect(mapStateToProps, actions)(_ShippingDetailsPanel);
