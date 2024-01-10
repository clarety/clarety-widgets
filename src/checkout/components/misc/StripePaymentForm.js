import React from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';

export function StripePaymentForm({ paymentMethod, customerInfo, layout = 'tabs' }) {
  return (
    <PaymentElement
      className="stripe-payment-form"
      options={{
        layout: layout,
        defaultValues: {
          billingDetails: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address.address1,
              line2: customerInfo.address.address2,
              city: customerInfo.address.suburb,
              state: customerInfo.address.state,
              country: customerInfo.address.country,
              postal_code: customerInfo.address.postcode,
            },
          },
        },
      }}
    />
  );
}
