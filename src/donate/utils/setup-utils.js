import { Resources } from 'shared/utils';
import { SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg } from 'donate/components';

export const mapDonationSettings = (result) => ({
  currency: result.currency,
  priceHandles: result.offers,
  elements: result.elements,
  paymentMethods: result.paymentMethods,
});

export function setupDefaultResources() {
  Resources.setComponent('SuggestedAmount', SuggestedAmount);
  Resources.setComponent('SuggestedAmountLg', SuggestedAmountLg);
  Resources.setComponent('VariableAmount', VariableAmount);
  Resources.setComponent('VariableAmountLg', VariableAmountLg);
}
