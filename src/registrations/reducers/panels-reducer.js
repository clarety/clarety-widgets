import { types } from 'registrations/actions';

const initialState = [];

export const panelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.panelsPush:
      return [
        ...state,
        {
          name: action.name,
          data: action.data,
        },
      ];

    case types.panelsPop:
      return state.slice(0, action.index + 1);

    default:
      return state;
  }
};
