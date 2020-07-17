import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';

export const injectStripe = (PaymentPanelComponent) => {
  class PaymentPanel extends React.Component {
    static stripePromise = null;

    componentDidMount() {
      this.maybeLoadStripe();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.paymentMethods !== this.props.paymentMethods) {
        this.maybeLoadStripe();
      }
    }

    maybeLoadStripe() {
      if (this.shouldUseStripe() && !this.stripePromise) {
        const paymentMethod = this.getPaymentMethod();
        this.stripePromise = loadStripe(paymentMethod.publicKey);
      }
    }

    shouldUseStripe() {
      return !!this.getPaymentMethod();
    }

    getPaymentMethod() {
      const { paymentMethods } = this.props;

      console.log('getPaymentMethod', paymentMethods);

      if (!paymentMethods) return null;
      return paymentMethods.find(method => method.gateway === 'stripe' || method.gateway === 'stripe-sca');
    }

    render() {
      const { forwardedRef, ...props } = this.props;

      if (!this.shouldUseStripe() || !this.stripePromise) {

        console.log('not rendering elements');
        return <PaymentPanelComponent ref={forwardedRef} {...props} />;
      }

      console.log('rendering elements!');

      return (
        <Elements stripe={this.stripePromise}>
          <ElementsConsumer>
            {({ stripe, elements }) => (
              <PaymentPanelComponent
                ref={forwardedRef}
                stripe={stripe}
                elements={elements}
                {...props}
              />
            )}
          </ElementsConsumer>
        </Elements>
      );
    }
  }

  const ForwardRefPaymentPanel = React.forwardRef((props, ref) => (
    <PaymentPanel {...props} forwardedRef={ref} />
  ));

  ForwardRefPaymentPanel.name = 'PaymentPanel';

  return ForwardRefPaymentPanel;
};
