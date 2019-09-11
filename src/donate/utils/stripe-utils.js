export const createStripeToken = ({ cardNumber, expiryMonth, expiryYear, ccv }, stripeKey) => {
  const { Stripe } = window;
  if (!Stripe) throw new Error('[Clarety] Stripe not found');

  Stripe.setPublishableKey(stripeKey);

  const card = {
    number: cardNumber,
    exp_month: expiryMonth,
    exp_year: expiryYear,
    cvc: ccv,
  };

  return new Promise((resolve, reject) => {
    Stripe.card.createToken(card, (status, response) => resolve(response));
  });
};

export const validateCard = ({ cardNumber, expiryMonth, expiryYear, ccv }) => {
  const { Stripe } = window;
  if (!Stripe) throw new Error('[Clarety] Stripe not found');

  const errors = [];

  if (!Stripe.card.validateCardNumber(cardNumber)) {
    errors.push({
      field: 'cardNumber',
      message: 'Invalid card number.',
    });
  }

  if (!Stripe.card.validateExpiry(expiryMonth, expiryYear)) {
    errors.push({
      field: 'expiry',
      message: 'Invalid expiry.',
    });
  }

  if (!Stripe.card.validateCVC(ccv)) {
    errors.push({
      field: 'ccv',
      message: 'Invalid CCV.',
    });
  }

  return errors.length ? errors : null;
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
    case 'exp_month': return 'payment.expiry';
    case 'exp_year':  return 'payment.expiry';
    case 'cvc':       return 'payment.ccv';
    default:          return undefined;
  }
};
