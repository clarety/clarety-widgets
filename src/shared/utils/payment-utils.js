import { Config } from 'shared/utils/config';

export function isCreditCard(paymentMethod) {
  return paymentMethod.type === 'gatewaycc';
}

export function isDirectDebit(paymentMethod) {
  return paymentMethod.type === 'gatewaydd' || paymentMethod.type === 'dd';
}

export function isStripe(paymentMethod) {
  return isStripeCard(paymentMethod) || isStripeBecs(paymentMethod) || isStripePaymentForm(paymentMethod);
}

export function isStripeCard(paymentMethod) {
  return paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca';
}

export function isStripeBecs(paymentMethod) {
  return paymentMethod.gateway === 'stripe-becs';
}

export function isStripePaymentForm(paymentMethod) {
  return paymentMethod.type === 'stripe-payment-form';
}

export function isPayPal(paymentMethod) {
  return paymentMethod.type === 'wallet' && paymentMethod.gateway === 'paypal';
}

export function isNzDirectDebit(paymentMethod) {
  return paymentMethod.type === 'gatewaydd' && paymentMethod.gateway === 'nz';
}

export function isHkDirectDebit(paymentMethod) {
  return paymentMethod.type === 'gatewaydd' && paymentMethod.gateway === 'hk';
}

export function isCaDirectDebit(paymentMethod) {
  return paymentMethod.type === 'gatewaydd' && paymentMethod.gateway === 'ca';
}

export function isNoPayment(paymentMethod) {
  return paymentMethod.type === 'na';
}

export function isMethodAllowedForFrequency(paymentMethod, frequency) {
  if (paymentMethod.singleOnly && frequency !== 'single') {
    return false;
  }

  if (paymentMethod.recurringOnly && frequency !== 'recurring') {
    return false;
  }
  
  return true;
}

export function toCents(dollarAmount) {
  return Math.floor(Number(dollarAmount) * 100);
}

export function splitName(fullName) {
  let firstName = '';
  let lastName = '';

  const nameParts = fullName.split(' ').filter(part => !!part.trim());
  if (nameParts.length === 1) {
    firstName = nameParts[0];
    lastName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else if (nameParts.length > 2) {
    lastName = nameParts.pop();
    firstName = nameParts.join(' ');
  }

  return { firstName, lastName };
}

export function convertCountry(country) {
  // for instances that aren't using valid iso codes
  if (!Config.get('useValidIsoCountryCodes')) {
    if (country === 'GB') return 'UK';
    if (country === 'TL') return 'TP';    
  }

  return country;
}
