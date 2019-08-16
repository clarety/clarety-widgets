import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { BasePanel, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { updateSale, fetchPaymentMethods, editPanel } from 'checkout/actions';
import { currency } from 'checkout/utils';

class _ShippingOptionsPanel extends BasePanel {
  state = {
    selectedOptionUid: null,
  };

  onPressContinue = () => {
    const { canContinue, fetchPaymentMethods } = this.props;
    if (canContinue) fetchPaymentMethods();
  };

  onSelectOption = uid => {
    this.setState({ selectedOptionUid: uid });
    this.props.updateSale(uid);
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
    canContinue: hasSelectedShippingOption(state),
    shippingOptions: state.checkout.shippingOptions,
    selectedOptionName: getSelectedShippingOptionLabel(state),
  };
};

const actions = {
  updateSale: updateSale,
  fetchPaymentMethods: fetchPaymentMethods,
  editPanel: editPanel,
};

export const ShippingOptionsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ShippingOptionsPanel);

// TODO: move to selectors...

const hasSelectedShippingOption = state => {
  return state.checkout.cart.sale
      && state.checkout.cart.sale.shippingOption;
};

const getSelectedShippingOptionLabel = state => {
  const { shippingOptions } = state.checkout;
  const { sale } = state.checkout.cart;

  if (shippingOptions && sale) {
    const option = shippingOptions.find(option => option.uid === sale.shippingOption);

    if (option) return option.label;
  }

  return '';
};
