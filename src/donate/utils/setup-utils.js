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

  validatePriceHandles(result.offers);
  
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

function validatePriceHandles(offers) {
  for (const offer of offers) {
    const variableAmounts = offer.amounts.filter(amount => amount.variable);
    if (!variableAmounts.length) {
      console.warn(`[Clarety] No variable amount (ie: $0 price handle) found for offer "${offer.name}" (UID: ${offer.offerUid})`);
    }
  }
}
