import { types } from 'registration/actions';

const initialState = {
  isBusyFetch: false,
  isBusySearch: false,
  isBusyPassword: false,
  isBusyCreate: false,
  isBusyPromoCode: false,
  searchResults: [],
};

export const teamsReducer = (state = initialState, action) => {
  switch (action.type) {

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

    // Promo Code

    case types.checkPromoCodeRequest:
      return {
        ...state,
        isBusyPromoCode: true,
      };

    case types.checkPromoCodeSuccess:
    case types.checkPromoCodeFailure:
      return {
        ...state,
        isBusyPromoCode: false,
      };

    default:
      return state;
  }
};
