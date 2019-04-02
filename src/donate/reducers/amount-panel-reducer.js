import { actionTypes } from '../actions';

const initialState = {
  frequency: null,
  selections: {},
};

const amountPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.selectFrequency: return _selectFrequency(state, action);
    case actionTypes.selectAmount:    return _selectAmount(state, action);
    case actionTypes.selectDefaults:  return _selectDefaults(state, action);
    default:                          return state;
  }
};

const _selectFrequency = (state, action) => {
  return {
    ...state,
    frequency: action.payload,
  };
};

const _selectAmount = (state, action) => {
  const { frequency, amount, isVariableAmount } = action.payload;

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

const _selectDefaults = (state, action) => {
  const donationOffers = action.payload;

  const defaultFrequency = donationOffers[0].frequency;
  const defaultSelections = {};

  for (let offer of donationOffers) {
    const defaultAmount = offer.suggestedAmounts.find(amount => amount.default);

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

export default amountPanelReducer;
