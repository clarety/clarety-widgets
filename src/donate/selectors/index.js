import { statuses } from 'shared/actions';

export function getIsBusy(state) {
  return state.status !== statuses.ready;
}

export function getSaleline(state) {
  return state.cart.salelines[0];
}

export function getFrequencyLabel(state, offerUid) {
  for (let offer of state.settings.offers) {
    if (offer.offerUid === offerUid) return offer.label;
  }

  return '';
}
