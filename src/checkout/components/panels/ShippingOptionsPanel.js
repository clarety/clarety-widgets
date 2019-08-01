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
    const { shippingOptions, canContinue } = this.props;

    return (
      <div>
        <h2>4. Shipping Options</h2>
        <hr />

        {shippingOptions && shippingOptions.map(this.renderShippingOption)}

        <Button onClick={this.onPressContinue} disabled={!canContinue}>Continue</Button>
      </div>
    );
  }

  renderShippingOption = (option, index) => {
    const { selectShippingOption, selectedKey } = this.props;

    return (
      <Form.Check type="radio" id={option.key} key={option.key}>
        <Form.Check.Input
          type="radio"
          name="shippingOption"
          checked={selectedKey === option.key}
          onChange={() => selectShippingOption(option.key)}
        />

        <Form.Check.Label>{option.label} ${option.cost}</Form.Check.Label>

        {option.date &&
          <p>Estimated Delivery Date: {option.date}</p>
        }
      </Form.Check>
    );
  };

  renderDone() {
    const { selectedOptionName } = this.props;

    return (
      <div>
        <h2 style={{ display: 'inline', opacity: 0.3 }}>4.</h2> {selectedOptionName} <Button onClick={this.onPressEdit}>Edit</Button>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedKey: state.data.shippingOption,
    canContinue: !!state.data.shippingOption,
    shippingOptions: state.cart.shippingOptions,
    selectedOptionName: getSelectedShippingOptionLabel(state),
  };
};

const actions = {
  selectShippingOption: selectShippingOption,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ShippingOptionsPanel = connect(mapStateToProps, actions)(_ShippingOptionsPanel);

// TODO: move to selectors...
const getSelectedShippingOptionLabel = state => {
  const { shippingOptions } = state.cart;
  const { shippingOption } = state.data;

  if (shippingOptions && shippingOption) {
    const option = shippingOptions.find(option => option.key === shippingOption);

    if (option) return option.label;
  }

  return '';
};
