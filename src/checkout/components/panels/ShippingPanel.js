import React from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { BasePanel, Button } from 'checkout/components';
import { currency } from 'shared/utils';

export class ShippingPanel extends BasePanel {
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
          <span className="cost">{currency(option.amount)}</span>
        </Form.Check.Label>

        {option.expectedDelivery && <p className="date">Estimated Delivery Date: {option.expectedDelivery}</p>}
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
