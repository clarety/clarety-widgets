import React from 'react';
import { connect } from 'react-redux';
import { Col, Form } from 'react-bootstrap';
import { TextInput, Button } from 'checkout/components';
import { FormContext } from 'checkout/utils';

class _CartSummary extends React.Component {
  state = {
    formData: {},
    errors: [],
    onChange: () => {},
  };

  onPressApplyDiscount = () => {
    // TODO:
    console.log('apply discount...');
  };

  render() {
    const { cart } = this.props;
    if (!cart || !cart.lines) return null;

    return (
      <div>
        {cart.lines.map(saleline =>
          <Saleline saleline={saleline} key={saleline.id} />
        )}

        <hr />

        <FormContext.Provider value={this.state}>
          <Form>
            <Form.Row>
              <Col>
                <TextInput field="discountCode" placeholder="Discount Code" />
              </Col>
              <Col xs="auto">
                <Button
                  title="Apply"
                  onClick={this.onPressApplyDiscount}
                  // isBusy={} TODO:
                  // disabled={} TODO:
                />
              </Col>
            </Form.Row>
          </Form>
        </FormContext.Provider>

        <hr />

        <CartTotals summary={cart.summary} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.checkout.cart,
  };
};

const actions = {};

export const CartSummary = connect(mapStateToProps, actions)(_CartSummary);


const Saleline = ({ saleline }) => (
  <p>{saleline.description}</p>
);


const CartTotals = ({ summary }) => (
  <React.Fragment>
    <dl className="row">
      <TotalLine label="Subtotal" value={summary.subtotal} />
      <TotalLine label="Shipping" value={summary.shipping} />
      <TotalLine label="Discount Code" value={summary.discount} />
    </dl>

    <hr />

    <dl className="row">
      <TotalLine label="Total in AUD" value={summary.total} />
    </dl>
  </React.Fragment>
);

const TotalLine = ({ label, value }) => {
  if (!value) return null;

  return (
    <React.Fragment>
      <dt className="col-sm-9">{label}</dt>
      <dd className="col-sm-3 text-right">{currency(value)}</dd>
    </React.Fragment>
  );
};

// TODO: move to shared utils...
function currency(number) {
  return `$${number.toFixed(2)}`;
}

