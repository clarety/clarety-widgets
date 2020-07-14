import React from 'react';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PayPalBtn } from 'shared/components';
import { ErrorMessages } from 'form/components';

export class ExpressCheckoutPanel extends BasePanel {
  getPaymentMethod(type) {
    return this.props.paymentMethods.find(method => method.type === type);
  }

  shouldShowPaymentMethod(method) {
    const { frequency } = this.props;

    if (!method) return false;

    if (method.singleOnly && frequency !== 'single') {
      return false;
    }

    if (method.recurringOnly && frequency !== 'recurring') {
      return false;
    }

    return true;
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="express-checkout-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title || t('expressCheckoutPanel.waitTitle', 'Express Checkout')}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, isBusy, settings } = this.props;

    const paypal = this.getPaymentMethod('paypal');

    // Don't display if there's no valid payment methods.
    if (!paypal) return null;

    return (
      <PanelContainer layout={layout} status="edit" className="express-checkout-panel">
        {!settings.hideHeader &&
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={settings.title || t('expressCheckoutPanel.editTitle', 'Express Checkout')}
          />
        }

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          <ErrorMessages />

          <div className="express-checkout-buttons">
            {this.shouldShowPaymentMethod(paypal) &&
              <PayPalBtn
                paymentMethod={paypal}
                currency={this.props.currency}
                amount={this.props.amount}
                onClick={this.props.onPayPalClick}
                onSuccess={this.props.onPayPalSuccess}
                onCancel={this.props.onPayPalCancel}
                onError={this.props.onPayPalError}
              />
            }
          </div>
          
          {!settings.hideOrTitle &&
            <div className="express-checkout-or">
              <div className="line" />
              <h2 className="title">{settings.orTitle || 'Or'}</h2>
              <div className="line" />
            </div>
          }
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="express-checkout-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title || t('expressCheckoutPanel.doneTitle', 'Express Checkout')}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
