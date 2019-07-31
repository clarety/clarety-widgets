import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel, TextInput, CheckboxInput } from 'checkout/components';
import { setShippingDetails, nextPanel, editPanel } from 'checkout/actions';
import { FormContext } from 'checkout/utils';

class _ShippingDetailsPanel extends BasePanel {
  onPressContinue = () => {
    if (this.validate()) {
      this.props.setShippingDetails(this.state.formData);
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
                <TextInput field="shipping.address" placeholder="Address *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="shipping.suburb" placeholder="Suburb *" />
              </Col>
              <Col>
                <TextInput field="shipping.state" placeholder="State *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="shipping.postcode" placeholder="Postcode *" />
              </Col>
              <Col>
                <TextInput field="shipping.country" placeholder="Country *" />
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
                <TextInput field="billing.address" placeholder="Address *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="billing.suburb" placeholder="Suburb *" />
              </Col>
              <Col>
                <TextInput field="billing.state" placeholder="State *" />
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <TextInput field="billing.postcode" placeholder="Postcode *" />
              </Col>
              <Col>
                <TextInput field="billing.country" placeholder="Country *" />
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <Button onClick={this.onPressContinue}>Continue</Button>
      </div>
    );
  }

  renderDone() {
    const address = this.props.shippingDetails['shipping.address'];
    const suburb = this.props.shippingDetails['shipping.suburb'];

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
  setShippingDetails: setShippingDetails,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ShippingDetailsPanel = connect(mapStateToProps, actions)(_ShippingDetailsPanel);
