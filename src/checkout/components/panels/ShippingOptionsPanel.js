import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { setFormData } from 'form/actions';
import { BasePanel, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { statuses, updateSale, fetchPaymentMethods } from 'checkout/actions';
import { hasSelectedShippingOption, getSelectedShippingOptionLabel } from 'checkout/selectors';
import { currency } from 'shared/utils';

class _ShippingOptionsPanel extends BasePanel {
  onPressContinue = async () => {
    const { canContinue, fetchPaymentMethods, nextPanel } = this.props;
    if (!canContinue) return;

    const didFetch = await fetchPaymentMethods();
    if (!didFetch) return;

    nextPanel();
  };

  onSelectOption = uid => {
    this.props.setFormData({ 'sale.shippingOption': uid });
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

        <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
          {shippingOptions && shippingOptions.map(this.renderShippingOption)}

          <div className="text-right mt-3">
            <Button
              title="Continue"
              onClick={this.onPressContinue}
              isBusy={isBusy}
              disabled={!canContinue}
            />
          </div>
        </BlockUi>
      </div>
    );
  }

  renderShippingOption = (option, index) => {
    return (
      <Form.Check type="radio" id={option.uid} key={option.uid} className="shipping-option">
        <Form.Check.Input
          type="radio"
          name="shippingOption"
          checked={this.props.selectedOptionUid === option.uid}
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
    isBusy: state.status === statuses.busy,
    canContinue: hasSelectedShippingOption(state),
    selectedOptionUid: state.formData['sale.shippingOption'],
    shippingOptions: state.cart.shippingOptions,
    selectedOptionName: getSelectedShippingOptionLabel(state),
  };
};

const actions = {
  setFormData: setFormData,
  updateSale: updateSale,
  fetchPaymentMethods: fetchPaymentMethods,
};

export const ShippingOptionsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ShippingOptionsPanel);
