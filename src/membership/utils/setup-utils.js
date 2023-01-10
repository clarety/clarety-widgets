import { SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg, SuggestedAmountPriceOnly } from 'donate/components';

export const mapMembershipWidgetSettings = (result) => {
  const membershipOffers = result.offers.filter(offer => offer.type === 'membership');
  const donationOffers = result.offers.filter(offer => offer.type === 'donation');

  if (donationOffers.length) {
    validatePriceHandles(donationOffers);
  }

  const settings = {
    currency: result.currency,
    membershipOffers: membershipOffers,
    priceHandles: donationOffers,
    elements: result.elements,
    paymentMethods: result.paymentMethods,
  };
  
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
      throw new Error(`[Clarety] No variable amount (ie: $0 price handle) found for offer "${offer.name}" (UID: ${offer.offerUid})`);
    }
  }
}
