import { actionTypes } from '../actions';

const initialState = {
  frequency: null,
  selections: {},
};

const amountPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.selectFrequency: return _selectFrequency(state, action);
    case actionTypes.selectAmount: return _selectAmount(state, action);
    default: return state;
  }
};

const _selectFrequency = (state, action) => {
  return {
    ...state,
    frequency: action.payload,
  };
};

const _selectAmount = (state, action) => {
  const { frequency, index, amount, variableAmount } = action.payload;

  const selections = { ...state.selections };

  selections[frequency] = selections[frequency] || {};
  selections[frequency].index = index;
  selections[frequency].amount = amount;

  if (variableAmount !== null) {
    selections[frequency].variableAmount = variableAmount;
  }

  return {
    ...state,
    selections,
  };  
};

export default amountPanelReducer;
