import ClaretyConfig from '../../shared/services/clarety-config';

export const createStripeToken = ({ cardNumber, expiryMonth, expiryYear, ccv }) => {
  const { Stripe } = window;

  const stripeKey = ClaretyConfig.get('stripeKey');
  if (!stripeKey) throw new Error("[Clarety] 'stripeKey' not found in ClaretyConfig");

  Stripe.setPublishableKey(stripeKey);

  return new Promise((resolve, reject) => {
    const card = {
      number: cardNumber,
      exp_month: expiryMonth,
      exp_year: expiryYear,
      cvc: ccv,
    };

    Stripe.card.createToken(card, (status, response) => resolve(response));
  });
};

export const validateCard = ({ cardNumber, expiryMonth, expiryYear, ccv }) => {
  const { Stripe } = window;

  const errors = [];

  if (!Stripe.card.validateCardNumber(cardNumber)) {
    errors.push({
      field: 'cardNumber',
      message: 'Invalid card number.',
    });
  }

  if (!Stripe.card.validateExpiry(expiryMonth, expiryYear)) {
    errors.push({
      field: 'expiryMonth',
      message: 'Invalid date.',
    });
    errors.push({
      field: 'expiryYear',
      message: 'Invalid date.',
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
    case 'number': return 'cardNumber';
    case 'exp_month': return 'expiryMonth';
    case 'exp_year': return 'expiryYear';
    case 'cvc': return 'ccv';

    default: return undefined;
  }
};
