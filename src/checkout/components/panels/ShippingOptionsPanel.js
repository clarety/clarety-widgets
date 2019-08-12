import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { BasePanel, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { updateFormData, updateCheckout, nextPanel, editPanel } from 'checkout/actions';
import { currency } from 'checkout/utils';

class _ShippingOptionsPanel extends BasePanel {
  onPressContinue = () => {
    const { canContinue, nextPanel } = this.props;
    if (canContinue) nextPanel();
  };

  onSelectOption = key => {
    this.props.updateFormData({ shippingOption: key });
    this.props.updateCheckout({ shouldAdvance: false });
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
      <Form.Check type="radio" id={option.key} key={option.key} className="shipping-option">
        <Form.Check.Input
          type="radio"
          name="shippingOption"
          checked={this.props.selectedKey === option.key}
          onChange={() => this.onSelectOption(option.key)}
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
    selectedKey: state.formData.shippingOption,
    canContinue: !!state.formData.shippingOption,
    shippingOptions: state.checkout.cart.shippingOptions,
    selectedOptionName: getSelectedShippingOptionLabel(state),
  };
};

const actions = {
  updateFormData: updateFormData,
  updateCheckout: updateCheckout,
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const ShippingOptionsPanel = connect(mapStateToProps, actions)(_ShippingOptionsPanel);

// TODO: move to selectors...
const getSelectedShippingOptionLabel = state => {
  const { shippingOptions } = state.checkout.cart;
  const { shippingOption } = state.formData;

  if (shippingOptions && shippingOption) {
    const option = shippingOptions.find(option => option.key === shippingOption);

    if (option) return option.label;
  }

  return '';
};
