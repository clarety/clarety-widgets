import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentRequestButtonElement, useStripe, Elements } from '@stripe/react-stripe-js';
import { toCents } from 'shared/utils';
import { getCart } from 'shared/selectors';
import { getPaymentMethod } from 'checkout/selectors';
import { fetchStripePaymentIntent, makeStripeWalletPayment, fetchStripeShippingOptions, selectDigitalWalletShippingOption } from 'checkout/actions';

export const CheckoutStripeWalletBtnInner = (props) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: props.paymentMethod.country,
        currency: props.cart.currency.code.toLowerCase(),
        total: cartToStripeDisplayTotal(props.cart),
        displayItems: cartToStripeDisplayItems(props.cart),
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        requestShipping: props.cart.shippingRequired,
      });

      pr.canMakePayment().then(result => {
        if (result) {
          // the button will show.
          if (props.onShowBtn) props.onShowBtn();          

          setPaymentRequest(pr);

          pr.on('shippingaddresschange', async (event) => {
            const shippingOptions = await props.fetchStripeShippingOptions(event.shippingAddress);
            if (!shippingOptions || !shippingOptions.length) {
              event.updateWith({
                status: 'invalid_shipping_address',
              });
            } else {
              // auto-select the first shipping option.
              const updatedCart = await props.selectDigitalWalletShippingOption(shippingOptions[0].id);

              event.updateWith({
                status: 'success',
                shippingOptions: shippingOptions,
                total: cartToStripeDisplayTotal(updatedCart),
                displayItems: cartToStripeDisplayItems(updatedCart),
              });
            }
          });

          pr.on('shippingoptionchange', async (event) => {
            const updatedCart = await props.selectDigitalWalletShippingOption(event.shippingOption.id);
            if (updatedCart) {
              event.updateWith({
                status: 'success',
                total: cartToStripeDisplayTotal(updatedCart),
                displayItems: cartToStripeDisplayItems(updatedCart),
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
  cart: getCart(state),
});

const actions = {
  fetchStripePaymentIntent: fetchStripePaymentIntent,
  makeStripeWalletPayment: makeStripeWalletPayment,
  fetchStripeShippingOptions: fetchStripeShippingOptions,
  selectDigitalWalletShippingOption: selectDigitalWalletShippingOption,
};

export const CheckoutStripeWalletBtn = connect(mapStateToProps, actions)(_CheckoutStripeWalletBtn);

function cartToStripeDisplayTotal(cart) {
  return {
    label: 'Total',
    amount: toCents(cart.summary.total),
  };
}

function cartToStripeDisplayItems(cart) {
  // Map cart items.
  let displayItems = cart.items.map(item => ({
    label: item.quantity > 1 ? `${item.description} (x ${item.quantity})` : item.description,
    amount: toCents(item.total),
  }));

  // Add shipping if present.
  const shippingAmount = toCents(cart.summary.shipping);
  if (cart.shippingRequired && shippingAmount) {
    displayItems.push({
      label: 'Shipping',
      amount: shippingAmount,
    });
  }

  return displayItems;
}
