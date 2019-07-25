import { types } from 'registrations/actions';

const initialState = [];

export const panelStackReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.panelStackPush:
      return [
        ...state,
        {
          name: action.panel,
          progress: action.progress,
          props: action.props,
        },
      ];

    case types.panelStackPop:
      return state.slice(0, action.index + 1);

    default:
      return state;
  }
};
