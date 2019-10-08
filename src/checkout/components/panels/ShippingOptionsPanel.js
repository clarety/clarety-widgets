import React from 'react';
import { connect } from 'react-redux';
import { Form, Spinner } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses } from 'shared/actions';
import { setFormData } from 'form/actions';
import { BasePanel, Button } from 'checkout/components';
import { WaitPanelHeader, EditPanelHeader, DonePanelHeader } from 'checkout/components';
import { updateSale, fetchShippingOptions } from 'checkout/actions';
import { hasSelectedShippingOption, getSelectedShippingOptionLabel } from 'checkout/selectors';
import { currency } from 'shared/utils';

class _ShippingOptionsPanel extends BasePanel {
  onPressContinue = async () => {
    const { canContinue, nextPanel } = this.props;
    if (!canContinue) return;
    nextPanel();
  };

  onSelectOption = uid => {
    this.props.setFormData({ 'sale.shippingOption': uid });
    this.props.updateSale(uid);
  };

  onShowPanel() {
    this.props.fetchShippingOptions();
  }

  renderWait() {
    const { index } = this.props;
    return (
      <WaitPanelHeader number={index + 1} title="Shipping Options" />
    );
  }

  renderEdit() {
    const { shippingOptions, index } = this.props;

    return (
      <div className="panel">
        <EditPanelHeader number={index + 1} title="Shipping Options" />

        {shippingOptions
          ? this.renderForm()
          : this.renderSpinner()
        }
      </div>
    );
  }

  renderForm() {
    const { shippingOptions, canContinue, isBusy } = this.props;

    return (
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

  renderSpinner() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  renderDone() {
    const { selectedOptionName, index } = this.props;

    return (
      <DonePanelHeader
        number={index + 1}
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
  fetchShippingOptions: fetchShippingOptions,
  setFormData: setFormData,
  updateSale: updateSale,
};

export const ShippingOptionsPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ShippingOptionsPanel);
