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
