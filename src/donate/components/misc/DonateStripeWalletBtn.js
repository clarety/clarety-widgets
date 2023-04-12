import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentRequestButtonElement, useStripe, Elements } from '@stripe/react-stripe-js';
import { getSetting } from 'shared/selectors';
import { getPaymentMethod, getDonationPanelSelection, getSelectedFrequency } from 'donate/selectors';
import { fetchStripePaymentIntent, makeStripeWalletPayment } from 'donate/actions';

export const DonateStripeWalletBtnInner = (props) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: props.country,
        currency: props.currency,
        total: {
          label: 'Donation',
          amount: props.amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);

          pr.on('paymentmethod', async (event) => {
            const { paymentMethod } = event;

            const pi = await props.fetchStripePaymentIntent({ amount: props.amount, currency: props.currency });
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
                    props.makeStripeWalletPayment(paymentMethod, paymentIntent);
                  }
                } else {
                  props.makeStripeWalletPayment(paymentMethod, paymentIntent);
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
        options={{paymentRequest}}
      />
    );
  }

  return null;
};

export const _DonateStripeWalletBtn = (props) => {
  const { paymentMethod, frequency } = props;

  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    // Make sure we should display.
    const shouldHide = !paymentMethod
      || (paymentMethod.singleOnly && frequency !== 'single')
      || (paymentMethod.recurringOnly && frequency !== 'recurring');

    if (!shouldHide && !stripePromise) {
      setStripePromise(loadStripe(paymentMethod.publicKey));
    }
  }, [props]);

  if (!stripePromise) return null;

  return (
    <Elements stripe={stripePromise}>
      <DonateStripeWalletBtnInner {...props} />
    </Elements>
  );
};

const mapStateToProps = (state, ownProps) => ({
  paymentMethod: getPaymentMethod(state, 'stripe-wallet'),
  currency: getSetting(state, 'currency').code.toLowerCase(),
  amount: Math.floor(Number(getDonationPanelSelection(state).amount) * 100),
  frequency: getSelectedFrequency(state),
  country: getSetting(state, 'defaultCountry'),
});

const actions = {
  fetchStripePaymentIntent: fetchStripePaymentIntent,
  makeStripeWalletPayment: makeStripeWalletPayment,
};

export const DonateStripeWalletBtn = connect(mapStateToProps, actions)(_DonateStripeWalletBtn);
