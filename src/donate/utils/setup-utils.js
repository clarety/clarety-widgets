import { SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg } from 'donate/components';

export const mapDonationSettings = (result) => ({
  currency: result.currency,
  priceHandles: result.offers,
  elements: result.elements,
  paymentMethods: result.paymentMethods,
});

export function setupDefaultResources(resources) {
  resources.setComponent('SuggestedAmount', SuggestedAmount);
  resources.setComponent('SuggestedAmountLg', SuggestedAmountLg);
  resources.setComponent('VariableAmount', VariableAmount);
  resources.setComponent('VariableAmountLg', VariableAmountLg);
}
