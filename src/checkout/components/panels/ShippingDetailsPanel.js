import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel, TextInput, CheckboxInput } from 'checkout/components';
import { updateFormData, nextPanel, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _ShippingDetailsPanel extends BasePanel {
  onPressContinue = () => {
    if (this.validate()) {
      this.props.updateFormData(this.state.formData);
      this.props.nextPanel();
    }
  };

  validate() {
    // TODO: validate fields...
    return true;
  }

  renderWait() {
    return (
      <div>
        <h2 style={{ opacity: 0.3 }}>3. Shipping Details</h2>
        <hr />
      </div>
    );
  }

  renderEdit() {
    return (
      <div>
        <h2>3. Shipping Details</h2>
        <hr />
        
        <FormContext.Provider value={this.state}>
          <Form>
            <h5>Shipping Address</h5>
            <Form.Row>
              <Col>
                <TextInput field="customer.shipping.address" placeholder="Address *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.shipping.suburb" placeholder="Suburb *" />
              </Col>
              <Col>
                <TextInput field="customer.shipping.state" placeholder="State *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.shipping.postcode" placeholder="Postcode *" />
              </Col>
              <Col>
                <TextInput field="customer.shipping.country" placeholder="Country *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <CheckboxInput field="billingSameAsShipping" label="Billing Address is the same as Shipping Address" />
              </Col>
            </Form.Row>

            <h5>Billing Address</h5>
            <Form.Row>
              <Col>
                <TextInput field="customer.billing.address" placeholder="Address *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.billing.suburb" placeholder="Suburb *" />
              </Col>
              <Col>
                <TextInput field="customer.billing.state" placeholder="State *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="customer.billing.postcode" placeholder="Postcode *" />
              </Col>
              <Col>
                <TextInput field="customer.billing.country" placeholder="Country *" />
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <Button onClick={this.onPressContinue}>Continue</Button>
      </div>
    );
  }

  renderDone() {
    const { formData } = this.state;
    const address = formData['customer.shipping.address'];
    const suburb = formData['customer.shipping.suburb'];

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>3.</h2> {address}, {suburb} <Button onClick={this.onPressEdit}>Edit</Button>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    shippingDetails: state.data.shippingDetails,
  };
};

const actions = {
  updateFormData: updateFormData,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ShippingDetailsPanel = connect(mapStateToProps, actions)(_ShippingDetailsPanel);
