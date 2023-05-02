import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentRequestButtonElement, useStripe, Elements } from '@stripe/react-stripe-js';
import { toCents } from 'shared/utils';
import { getSetting, getCart, getCartShippingRequired } from 'shared/selectors';
import { getPaymentMethod } from 'checkout/selectors';
import { fetchStripePaymentIntent, makeStripeWalletPayment, fetchStripeShippingOptions } from 'checkout/actions';

export const CheckoutStripeWalletBtnInner = (props) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: props.country === 'UK' ? 'GB' : props.country,
        currency: props.currency,
        total: {
          label: 'Total',
          amount: props.amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        requestShipping: props.isShippingRequired,
      });

      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);

          pr.on('shippingaddresschange', async (event) => {
            const shippingOptions = await props.fetchStripeShippingOptions(event.shippingAddress);
            if (!shippingOptions || !shippingOptions.length) {
              event.updateWith({
                status: 'invalid_shipping_address',
              });
            } else {
              event.updateWith({
                status: 'success',
                shippingOptions: shippingOptions,
              });
            }
          });

          pr.on('paymentmethod', async (event) => {
            const { paymentMethod, shippingAddress, shippingOption } = event;

            const pi = await props.fetchStripePaymentIntent();
            if (pi && pi.clientSecret) {
              const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                pi.clientSecret,
                { payment_method: paymentMethod.id },
                { handleActions: false }
              );

              if (confirmError) {
                event.complete('fail');
              } else {
                event.complete('success');

                if (paymentIntent.status === "requires_action") {
                  const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
                  if (actionError) {
                    console.error('stripe wallet action failed', actionError);
                  } else {
                    props.makeStripeWalletPayment(paymentMethod, paymentIntent, shippingAddress, shippingOption);
                  }
                } else {
                  props.makeStripeWalletPayment(paymentMethod, paymentIntent, shippingAddress, shippingOption);
                }
              }
            }
          });
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    return (
      <PaymentRequestButtonElement
        options={{
          paymentRequest,
          style: {
            paymentRequestButton: {
              height: '45px',
            },
          },
        }}
      />
    );
  }

  return null;
};

export const _CheckoutStripeWalletBtn = (props) => {
  const { paymentMethod } = props;
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    if (!stripePromise) {
      setStripePromise(loadStripe(paymentMethod.publicKey));
    }
  }, [props]);

  if (!stripePromise) return null;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutStripeWalletBtnInner {...props} />
    </Elements>
  );
};

const mapStateToProps = (state, ownProps) => ({
  paymentMethod: getPaymentMethod(state, 'wallet', 'stripe'),
  currency: getCart(state).currency.code.toLowerCase(),
  amount: toCents(getCart(state).summary.subTotal),
  country: getSetting(state, 'defaultCountry'),
  isShippingRequired: getCartShippingRequired(state),
});

const actions = {
  fetchStripePaymentIntent: fetchStripePaymentIntent,
  makeStripeWalletPayment: makeStripeWalletPayment,
  fetchStripeShippingOptions: fetchStripeShippingOptions,
};

export const CheckoutStripeWalletBtn = connect(mapStateToProps, actions)(_CheckoutStripeWalletBtn);
