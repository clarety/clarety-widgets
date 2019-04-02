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

  const selections = { ...state.selections };

  selections[frequency] = selections[frequency] || {};
  selections[frequency].amount = amount;
  selections[frequency].isVariableAmount = isVariableAmount;
  if (isVariableAmount) selections[frequency].variableAmount = amount;

  return {
    ...state,
    selections,
  };  
};

const _selectDefaults = (state, action) => {
  const donationOffers = action.payload;

  const defaultFrequency = donationOffers[0].frequency;
  const defaultSelections = {};

  for (let offer of donationOffers) {
    const index = offer.suggestedAmounts.findIndex(option => option.default);
    if (index !== -1) {
      defaultSelections[offer.frequency] = {
        amount: offer.suggestedAmounts[index].amount,
        isVariableAmount: false,
      };
    }
  }

  return {
    ...state,
    frequency: defaultFrequency,
    selections: defaultSelections,
  };
};

export default amountPanelReducer;
