import { types } from 'registrations/actions';

const initialState = {
  isBusySearch: false,
  searchResults: [],
  selectedTeam: null,
};

export const teamPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.searchTeamsRequest:
      return {
        ...state,
        isBusySearch: true,
      };

    case types.searchTeamsSuccess:
      return {
        ...state,
        isBusySearch: false,
        searchResults: action.results,
      };

    case types.selectTeam:
      return {
        ...state,
        selectedTeam: action.team,
      };

    default:
      return state;
  }
};
