export function isStripe(paymentMethod) {
  return isStripeCard(paymentMethod) || isStripeAuBankAccount(paymentMethod);
}

export function isStripeCard(paymentMethod) {
  return paymentMethod.gateway === 'stripe' || paymentMethod.gateway === 'stripe-sca';
}

export function isStripeAuBankAccount(paymentMethod) {
  return paymentMethod.gateway === 'stripe-becs';
}

export function isHongKongDirectDebit(paymentMethod) {
  return paymentMethod.type === 'gatewaydd' && paymentMethod.gateway === 'hk';
}

export function toCents(dollarAmount) {
  return Math.floor(Number(dollarAmount) * 100);
}

export function splitName(fullName) {
  let firstName = '';
  let lastName = '';

  const nameParts = fullName.split(' ');
  if (nameParts.length === 1) {
    firstName = nameParts[0];
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1];
  } else if (nameParts.length > 2) {
    lastName = nameParts.pop();
    firstName = nameParts.join(' ');
  }

  return { firstName, lastName };
}
