import { actionTypes } from '../actions';

const initialState = {
  frequency: null,
  selections: {},
};

const amountPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.selectFrequency:
      return {
        ...state,
        frequency: action.payload,
      };

    case actionTypes.selectAmount:
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

    default:
      return state;
  }
};

export default amountPanelReducer;
