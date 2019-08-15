import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { BasePanel, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { selectShipping, nextPanel, editPanel } from 'checkout/actions';
import { currency } from 'checkout/utils';

class _ShippingOptionsPanel extends BasePanel {
  state = {
    selectedOptionUid: null,
  };

  onPressContinue = () => {
    const { canContinue, nextPanel } = this.props;
    if (canContinue) nextPanel();
  };

  onSelectOption = uid => {
    this.setState({ selectedOptionUid: uid });
    this.props.selectShipping(uid);
  };

  renderWait() {
    return (
      <WaitPanelHeader number="4" title="Shipping Options" />
    );
  }

  renderEdit() {
    const { shippingOptions, canContinue, isBusy } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number="4" title="Shipping Options" />

        {shippingOptions && shippingOptions.map(this.renderShippingOption)}

        <div className="text-right mt-3">
          <Button
            title="Continue"
            onClick={this.onPressContinue}
            isBusy={isBusy}
            disabled={!canContinue}
          />
        </div>
      </div>
    );
  }

  renderShippingOption = (option, index) => {
    return (
      <Form.Check type="radio" id={option.uid} key={option.uid} className="shipping-option">
        <Form.Check.Input
          type="radio"
          name="shippingOption"
          checked={this.state.selectedOptionUid === option.uid}
          onChange={() => this.onSelectOption(option.uid)}
        />

        <Form.Check.Label>
          <span className="name">{option.label}</span>
          <span className="cost">{currency(option.cost)}</span>
        </Form.Check.Label>

        {option.date && <p className="date">Estimated Delivery Date: {option.date}</p>}
      </Form.Check>
    );
  };

  renderDone() {
    const { selectedOptionName } = this.props;

    return (
      <DonePanelHeader
        number="4"
        title={selectedOptionName}
        onPressEdit={this.onPressEdit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isBusy: state.checkout.isBusy,
    canContinue: !!state.checkout.cart.shippingOption,
    shippingOptions: state.checkout.shippingOptions,
    selectedOptionName: getSelectedShippingOptionLabel(state),
  };
};

const actions = {
  selectShipping: selectShipping,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ShippingOptionsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ShippingOptionsPanel);

// TODO: move to selectors...
const getSelectedShippingOptionLabel = state => {
  const { shippingOptions } = state.checkout;
  const { shippingOption } = state.checkout.cart;

  if (shippingOptions && shippingOption) {
    const option = shippingOptions.find(option => option.uid === shippingOption);

    if (option) return option.label;
  }

  return '';
};
