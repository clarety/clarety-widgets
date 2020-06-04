import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';

export const injectStripe = (PaymentPanelComponent) => {
  class PaymentPanel extends React.Component {
    static stripePromise = null;

    getPaymentMethod() {
      const { paymentMethods } = this.props;

      if (!paymentMethods) return null;

      return paymentMethods.find(method => method.gateway === 'stripe' || method.gateway === 'stripe-sca');
    }

    shouldUseStripe() {
      return !!this.getPaymentMethod();
    }

    constructor(props) {
      super(props);
      
      if (this.shouldUseStripe() && !this.stripePromise) {
        const paymentMethod = this.getPaymentMethod();
        this.stripePromise = loadStripe(paymentMethod.publicKey);
      }
    }

    render() {
      const { forwardedRef, ...props } = this.props;

      if (!this.shouldUseStripe()) return <PaymentPanelComponent ref={forwardedRef} {...props} />;

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
