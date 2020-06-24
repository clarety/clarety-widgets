import React from 'react';
import loadScript from 'load-script';

const elementId = 'express-paypal-button';

export class PayPalBtn extends React.Component {
  componentDidMount() {
    const url = this.getPayPalScriptUrl();
    loadScript(url, this.onLoadPayPalScript);
  }

  onLoadPayPalScript = (error, script) => {
    if (error) return console.log('[Clarety] load paypal script error:', error);
    if (!paypal) return console.log('[Clarety] PayPal not found.');

    paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,
      createOrder: this.createOrder,
      onInit: this.onInit,
      onClick: this.onClick,
      onApprove: this.onApprove,
      onCancel: this.onCancel,
      onError: this.onError,
    }).render(`#${elementId}`);
  };

  getPayPalScriptUrl() {
    const { currency, paymentMethod } = this.props;

    const clientId = paymentMethod.publicKey;
    const currencyCode = currency.code || 'AUD';
    const intent = 'authorize';

    return `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=${intent}&currency=${currencyCode}`;
  }

  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: this.props.amount } }]
    });
  };

  // onInit is called when the button first renders.
  onInit = (data, actions) => {
    if (this.props.onInit) return this.props.onInit(data, actions);
  };

  onClick = async (data, actions) => {
    if (!this.props.onClick) return actions.resolve();

    return await this.props.onClick(data)
      ? actions.resolve()
      : actions.reject();
  };

  onApprove = async (data, actions) => {
    const order = await actions.order.get();
    const authorization = await actions.order.authorize();
    this.props.onSuccess(data, order, authorization);
  };

  onCancel = (data) => {
    if (this.props.onCancel) return this.props.onCancel(data);
  };

  onError = (error) => {
    if (this.props.onError) return this.props.onError(error);
  };

  render() {
    return <div id={elementId}></div>;
  }
}
