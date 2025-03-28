import { types } from 'donate/actions';

const initialState = null;

export const rgUpsellReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setRgUpsell:
      return setRgUpsell(state, action);

    case types.clearRgUpsell:
      return clearRgUpsell(state, action);

    default:
      return state;
  }
};

function setRgUpsell(state, action) {
  return {
    offerUid: action.offerUid,
    scheduleUid: action.scheduleUid,
    scheduleName: action.scheduleName,
    amount: action.amount,
    previousAmount: action.previousAmount,
  };
}

function clearRgUpsell(state, action) {
  return null;
}
