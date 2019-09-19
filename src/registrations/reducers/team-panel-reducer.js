import { types } from 'registrations/actions';

const initialState = {
  status: 'prompt',
  isBusySearch: false,
  isBusyPassword: false,
  searchResults: [],
  selectedTeam: null,
};

export const teamPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    // Status

    case types.setTeamPanelStatus:
      return {
        ...state,
        status: action.status,
      };

    // Select
    
    case types.selectTeam:
      return {
        ...state,
        selectedTeam: action.team,
      };

    // Search

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

    // Check Password

    case types.checkTeamPasswordRequest:
      return {
        ...state,
        isBusyPassword: true,
      };

    case types.checkTeamPasswordSuccess:
    case types.checkTeamPasswordFailure:
      return {
        ...state,
        isBusyPassword: false,
      };

    default:
      return state;
  }
};
