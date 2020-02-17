export const createStripeToken = (paymentData, stripeKey) => {
  const { Stripe } = window;
  if (!Stripe) throw new Error('[Clarety] Stripe not found');

  Stripe.setPublishableKey(stripeKey);

  const card = {
    number:    paymentData.cardNumber,
    exp_month: paymentData.cardExpiryMonth,
    exp_year:  paymentData.cardExpiryYear,
    cvc:       paymentData.cardSecurityCode,
  };

  return new Promise((resolve, reject) => {
    Stripe.card.createToken(card, (status, response) => resolve(response));
  });
};

export const parseStripeError = error => {
  if (error.code === 'missing_payment_information') {
    return [{
      field: 'cardNumber',
      message: 'Please enter a card number.',
    }];
  }

  if (error.param) {
    return [{
      field: _stripeParamToField(error.param),
      message: error.message,
    }];
  }
  
  return [];
};

const _stripeParamToField = param => {
  switch (param) {
    case 'number':    return 'payment.cardNumber';
    case 'exp_month': return 'payment.cardExpiry';
    case 'exp_year':  return 'payment.cardExpiry';
    case 'cvc':       return 'payment.cardSecurityCode';
    default:          return undefined;
  }
};
