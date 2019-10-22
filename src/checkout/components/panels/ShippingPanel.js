import React from 'react';
import { connect } from 'react-redux';
import { Form, Spinner } from 'react-bootstrap';
import { statuses } from 'shared/actions';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { setFormData } from 'form/actions';
import { BasePanel, Button } from 'checkout/components';
import { updateSale, fetchShippingOptions } from 'checkout/actions';
import { hasSelectedShippingOption, getSelectedShippingOptionLabel } from 'checkout/selectors';
import { currency } from 'shared/utils';

class _ShippingPanel extends BasePanel {
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
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Shipping Options"
        />
        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, shippingOptions, index } = this.props;

    return (
      <PanelContainer layout={layout}>
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Shipping Options"
        />

        {shippingOptions
          ? this.renderForm()
          : this.renderSpinner()
        }
      </PanelContainer>
    );
  }

  renderForm() {
    const { layout, isBusy, shippingOptions, canContinue } = this.props;

    return (
      <PanelBody layout={layout} status="edit" isBusy={isBusy}>
        {shippingOptions && shippingOptions.map(this.renderShippingOption)}

        <div className="panel-actions">
          <Button
            title="Continue"
            onClick={this.onPressContinue}
            isBusy={isBusy}
            disabled={!canContinue}
          />
        </div>
      </PanelBody>
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
    const { layout, index, selectedOptionName } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={selectedOptionName}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
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

export const ShippingPanel = connect(mapStateToProps, actions, null, { forwardRef: true })(_ShippingPanel);
