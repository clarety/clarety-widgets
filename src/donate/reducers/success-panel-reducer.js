import { actionTypes } from '../actions';

const initialState = {
  result: null,
};

export const successPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setSuccessResult:
      return {
        ...state,
        result: action.result,
      };

    default:
      return state;
  }
};
