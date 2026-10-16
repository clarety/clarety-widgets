import React from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';

export function StripePaymentForm({ paymentMethod, customerInfo, layout = 'tabs', onChange = undefined, hideCountry = false }) {
  let fields = undefined;
  if (hideCountry && customerInfo.address.country) {
    fields = { billingDetails: { address: { country: 'never' } } };
  }

  return (
    <PaymentElement
      className="stripe-payment-form"
      options={{
        layout: layout,
        fields: fields,
        defaultValues: {
          billingDetails: customerInfo,
        },
      }}
      onChange={onChange}
    />
  );
}
