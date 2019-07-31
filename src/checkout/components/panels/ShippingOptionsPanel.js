import React from 'react';
import { connect } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import { BasePanel } from 'checkout/components';
import { selectShippingOption, nextPanel, editPanel } from 'checkout/actions';

class _ShippingOptionsPanel extends BasePanel {
  onPressContinue = () => {
    const { canContinue, nextPanel } = this.props;
    if (canContinue) nextPanel();
  };

  renderWait() {
    return (
      <div>
        <h2 style={{ opacity: 0.3 }}>4. Shipping Options</h2>
        <hr />
      </div>
    );
  }

  renderEdit() {
    const { shippingOptions, selectShippingOption, selectedId, canContinue } = this.props;

    return (
      <div>
        <h2>4. Shipping Options</h2>
        <hr />

        {shippingOptions.map(option =>
          <Form.Check type="radio" id={option.id} key={option.id}>
            <Form.Check.Input
              type="radio"
              name="shippingOption"
              checked={selectedId === option.id}
              onChange={() => selectShippingOption(option.id)}
            />
            <Form.Check.Label>{option.name} ${option.price}</Form.Check.Label>
            <p>Estimated Delivery Date: {option.estimatedDeliveryDate}</p>
          </Form.Check>
        )}

        <Button onClick={this.onPressContinue} disabled={!canContinue}>Continue</Button>
      </div>
    );
  }

  renderDone() {
    const { shippingOptionName } = this.props;

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>4.</h2> {shippingOptionName} <Button onClick={this.onPressEdit}>Edit</Button>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedId: state.data.selectedShippingOptionId,
    canContinue: state.data.selectedShippingOptionId !== null,

    // TODO: select this somehow...
    shippingOptionName: 'Australia Post',

    // TODO: load these from somewhere...
    shippingOptions: [
      {
        id: '123',
        name: 'Australia Post',
        estimatedDeliveryDate: '7 May 2020',
        price: 20,
      },
      {
        id: '456',
        name: 'UPS Express',
        estimatedDeliveryDate: '6 May 2020',
        price: 25,
      },
      {
        id: '789',
        name: 'UPS Express Premium',
        estimatedDeliveryDate: '4 May 2020',
        price: 35,
      },
    ],
  };
};

const actions = {
  selectShippingOption: selectShippingOption,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ShippingOptionsPanel = connect(mapStateToProps, actions)(_ShippingOptionsPanel);
