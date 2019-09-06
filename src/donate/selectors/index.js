import { statuses } from 'shared/actions';

export function getIsBusy(state) {
  return state.status !== statuses.ready;
}

export function getCartItem(state) {
  return state.cart.items[0];
}

export function getSelectedAmount(state) {
  const { amountPanel } = state.panels;
  const { currency } = state.settings;

  const selection = amountPanel.selections[amountPanel.frequency];

  if (!selection) return '';
  if (!selection.amount) return '';

  return currency.symbol + selection.amount;
}

export function getFrequencyLabel(state, offerUid) {
  for (let offer of state.settings.offers) {
    if (offer.offerUid === offerUid) return offer.label;
  }

  return '';
}
