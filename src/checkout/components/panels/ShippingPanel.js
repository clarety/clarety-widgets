import React from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { t } from 'shared/translations';
import { PanelContainer, PanelHeader, PanelBody, Currency } from 'shared/components';
import { BasePanel, Button } from 'checkout/components';

export class ShippingPanel extends BasePanel {
  onPressNext = async () => {
    const { canContinue, nextPanel, updateSale, selectedOptionUid } = this.props;

    if (canContinue) {
      await updateSale(selectedOptionUid);
      nextPanel();
    }
  };

  onSelectOption = (uid) => {
    this.props.setFormData({ 'sale.shippingUid': uid });
  };

  onShowPanel() {
    this.props.fetchShippingOptions();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (prevProps.shippingOptions !== this.props.shippingOptions) {
      this.selectDefaultShipping();
    }
  }

  selectDefaultShipping() {
    // If there's only one shipping option, just select it by default.

    const { shippingOptions, setFormData } = this.props;

    if (shippingOptions.length === 1) {
      const { shippingUid } = shippingOptions[0];
      setFormData({ 'sale.shippingUid': shippingUid });
    }
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={t('shipping-options', 'Shipping Options')}
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
          title={t('shipping-options', 'Shipping Options')}
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
            title={t('continue', 'Continue')}
            onClick={this.onPressNext}
            isBusy={isBusy}
            disabled={!canContinue}
          />
        </div>
      </PanelBody>
    );
  }

  renderShippingOption = (option) => {
    return (
      <Form.Check type="radio" id={option.shippingUid} key={option.shippingUid} className="shipping-option">
        <Form.Check.Input
          type="radio"
          name="shippingOption"
          checked={this.props.selectedOptionUid === option.shippingUid}
          onChange={() => this.onSelectOption(option.shippingUid)}
        />

        <Form.Check.Label>
          <span className="name">{option.label}</span>
          <span className="cost"><Currency amount={option.amount} /></span>
        </Form.Check.Label>

        {option.expectedDelivery &&
          <p className="date">
            {t('estimated-delivery-date', 'Estimated Delivery Date')}: {option.expectedDelivery}
          </p>
        }
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
