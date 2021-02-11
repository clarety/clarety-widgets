import { SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg, SuggestedAmountPriceOnly } from 'donate/components';

export const mapDonationSettings = (result) => {
  const settings = {
    currency: result.currency,
    priceHandles: result.offers,
    elements: result.elements,
    paymentMethods: result.paymentMethods,
  };

  if (result.funds && result.funds.length) {
    settings.funds = result.funds;
  }
  
  return settings;
};

export function setupDefaultResources(resources) {
  resources.setComponent('SuggestedAmount', SuggestedAmount);
  resources.setComponent('VariableAmount', VariableAmount);

  resources.setComponent('SuggestedAmountLg', SuggestedAmountLg);
  resources.setComponent('VariableAmountLg', VariableAmountLg);
  
  resources.setComponent('SuggestedAmountPriceOnly', SuggestedAmountPriceOnly);
  resources.setComponent('VariableAmountPriceOnly', VariableAmount);
}
