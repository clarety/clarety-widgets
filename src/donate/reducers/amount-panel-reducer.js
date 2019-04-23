import { actionTypes } from '../actions';

const initialState = {
  frequency: null,
  selections: {},
};

export const amountPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.selectFrequency: return _selectFrequency(state, action);
    case actionTypes.selectAmount:    return _selectAmount(state, action);
    case actionTypes.selectDefaults:  return _selectDefaults(state, action);
    default:                          return state;
  }
};

const _selectFrequency = (state, { frequency }) => {
  return {
    ...state,
    frequency,
  };
};

const _selectAmount = (state, { frequency, amount, isVariableAmount }) => {
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

const _selectDefaults = (state, { offers }) => {
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
