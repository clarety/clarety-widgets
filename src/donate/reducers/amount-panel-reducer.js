import { types as sharedActionTypes } from 'shared/actions';
import { types } from 'donate/actions';

const initialState = {
  frequency: null,
  selections: {},
};

export const amountPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.selectFrequency:
      return selectFrequency(state, action);

    case types.selectAmount:
      return selectAmount(state, action);

    case types.selectDefaults:
      return selectDefaults(state, action.offers);

    case sharedActionTypes.fetchSettingsSuccess:
      const offers = action.result.priceHandles || action.result.offers;
      return selectDefaults(state, offers);

    default:
      return state;
  }
};

const selectFrequency = (state, action) => {
  return {
    ...state,
    frequency: action.frequency,
  };
};

const selectAmount = (state, action) => {
  const { frequency, amount, isVariableAmount } = action;
  const prevVariableAmount = state.selections[frequency].variableAmount;

  const selection = {
    amount,
    isVariableAmount,
    variableAmount: isVariableAmount ? amount : prevVariableAmount,
  };

  return {
    ...state,
    selections: {
      ...state.selections,
      [frequency]: selection,
    }
  };
};

const selectDefaults = (state, offers) => {
  const defaultFrequency = offers[0].frequency;
  const defaultSelections = {};

  for (let offer of offers) {
    const defaultAmount = offer.amounts.find(amount => amount.default);

    defaultSelections[offer.frequency] = {
      amount: defaultAmount ? defaultAmount.amount : 0,
      isVariableAmount: false,
    };
  }

  return {
    ...state,
    frequency: defaultFrequency,
    selections: defaultSelections,
  };
};
