import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { getLanguage } from 'shared/translations';
import { isStripe, toCents } from 'shared/utils';

export const injectStripe = (PaymentPanelComponent) => {
  class PaymentPanel extends React.Component {
    static stripePromise = null;

    state = {
      isReady: false,
    };

    componentDidMount() {
      this.maybeLoadStripe();
      this.setState({ isReady: true });
    }

    componentDidUpdate(prevProps) {
      if (prevProps.paymentMethods !== this.props.paymentMethods) {
        this.maybeLoadStripe();
      }
    }

    maybeLoadStripe() {
      const locale = getLanguage();
      if (this.shouldUseStripe() && !this.stripePromise) {
        const paymentMethod = this.getPaymentMethod();
        this.stripePromise = loadStripe(paymentMethod.publicKey, { locale });
      }
    }

    shouldUseStripe() {
      return !!this.getPaymentMethod();
    }

    getPaymentMethod() {
      const { paymentMethods } = this.props;

      if (!paymentMethods) return null;
      return paymentMethods.find(method => isStripe(method));
    }

    render() {
      const { forwardedRef, ...props } = this.props;

      if (!this.state.isReady) return null;

      if (!this.shouldUseStripe() || !this.stripePromise) {
        return <PaymentPanelComponent ref={forwardedRef} {...props} />;
      }

      const paymentMethod = this.getPaymentMethod();

      const options = {};
      if (paymentMethod.type === 'stripe-payment-form') {
        options.mode = 'payment';
        options.paymentMethodCreation = 'manual';
        options.currency = this.props.currency.toLowerCase();

        // stripe will error if we give an amount of 0
        const dollarAmount = this.props.amount || 1.00;
        options.amount = toCents(dollarAmount);

        if (this.props.frequency) {
          // donations allow different payment types depending on frequency.
          if (this.props.frequency === 'recurring') {
            options.paymentMethodTypes = paymentMethod.recurringPaymentTypes;
          } else {
            options.paymentMethodTypes = paymentMethod.singlePaymentTypes;
          }
        } else {
          options.paymentMethodTypes = paymentMethod.allowedPaymentTypes;
        }
      }

      return (
        <Elements stripe={this.stripePromise} options={options}>
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
