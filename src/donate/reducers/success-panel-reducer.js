import { types } from '../actions';

const initialState = {
  result: null,
};

export const successPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.setSuccessResult:
      return {
        ...state,
        result: action.result,
      };

    default:
      return state;
  }
};
