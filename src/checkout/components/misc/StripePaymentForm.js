import React from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';

export function StripePaymentForm({ paymentMethod, customerInfo, layout = 'tabs' }) {
  return (
    <PaymentElement
      className="stripe-payment-form"
      options={{
        layout: layout,
        defaultValues: {
          billingDetails: customerInfo,
        },
      }}
    />
  );
}
