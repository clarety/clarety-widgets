import { types } from 'registrations/actions';

const initialState = {
  mode: 'prompt',
  isBusyFetch: false,
  isBusySearch: false,
  isBusyPassword: false,
  isBusyCreate: false,
  searchResults: [],
  selectedTeam: null,
};

export const teamPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    // Mode

    case types.setTeamPanelMode:
      return {
        ...state,
        mode: action.mode,
      };

    // Select
    
    case types.selectTeam:
      return {
        ...state,
        selectedTeam: action.team,
      };

    // Fetch

    case types.fetchTeamRequest:
        return {
          ...state,
          isBusyFetch: true,
        };
  
    case types.fetchTeamSuccess:
    case types.fetchTeamFailure:
      return {
        ...state,
        isBusyFetch: false,
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

    // Create

    case types.createTeamRequest:
      return {
        ...state,
        isBusyCreate: true,
      };

    case types.createTeamSuccess:
    case types.createTeamFailure:
      return {
        ...state,
        isBusyCreate: false,
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
