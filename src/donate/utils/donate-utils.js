export const mapDonationSettings = (result) => ({
  currency: result.currency,
  priceHandles: result.offers,
  elements: result.elements,
  payment: result.payment,
});
