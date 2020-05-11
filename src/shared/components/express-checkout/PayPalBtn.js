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

    const clientId = paymentMethod.clientId || paymentMethod.publicKey; // TODO: which is it?
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

  };

  onClick = (data, actions) => {
    const { onValidate } = this.props;

    // The onValidate callback prop is optional.
    if (!onValidate) return actions.resolve();

    return onValidate(data)
      ? actions.resolve()
      : actions.reject();
  };

  onApprove = async (data, actions) => {
    const order = await actions.order.get();
    const authorization = await actions.order.authorize();
    this.props.onSuccess(data, order, authorization);
  };

  onCancel = (data) => {
    console.log('paypal btn onCancel!');
  };

  onError = (error) => {
    console.log('paypal btn onError!');
    console.log('erorr', error);
  };

  render() {
    return <div id={elementId}></div>;
  }
}
