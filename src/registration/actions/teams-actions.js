import { ClaretyApi } from 'clarety-utils';
import { setOrganisation, removePanels, setPromoCode, updateAppSettings } from 'shared/actions';
import { setErrors, clearErrors } from 'form/actions';
import { getCreateTeamPostData } from 'registration/selectors';
import { parseTeamErrors } from 'registration/utils';
import { types } from 'registration/actions';

export const searchTeams = (query) => {
  return async (dispatch, getState) => {
    const state = getState();

    dispatch(searchTeamsRequest(query));

    const { storeId, seriesId } = state.settings;
    const results = await ClaretyApi.get('registration-teams/', { query, seriesId, storeId });
    
    dispatch(searchTeamsSuccess(results));
  };
};

export const createTeam = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const postData = getCreateTeamPostData(state);

    dispatch(clearErrors());
    dispatch(createTeamRequest(postData));
    
    const { storeId } = state.settings;
    const results = await ClaretyApi.post('registration-teams/', postData, { storeId });
    const result = results[0];

    if (!result.errors) {
      const team = await dispatch(fetchTeam(result.teamId));
      dispatch(setOrganisation(team));
      dispatch(createTeamSuccess(result));
      return true;
    } else {
      dispatch(createTeamFailure(result));
      const errors = parseTeamErrors(result);
      dispatch(setErrors(errors));
      return false;
    }
  };
};

export const fetchTeam = (teamId) => {
  return async (dispatch, getState) => {
    const state = getState();

    dispatch(fetchTeamRequest(teamId));

    const { storeId, seriesId } = state.settings;
    const results = await ClaretyApi.get('registration-teams/', { seriesId, storeId, teamId });
    const result = results[0];

    if (result) {
      dispatch(fetchTeamSuccess(result));
      return result;

    } else {
      dispatch(fetchTeamFailure(result));
      return null;
    }
  };
};

export const checkTeamPassword = (team, password) => {
  return async (dispatch, getState) => {
    const state = getState();

    const { storeId, seriesId } = state.settings;

    const postData = {
      teamId: team.teamId,
      seriesId: seriesId,
      password: password,
    };

    dispatch(clearErrors());
    dispatch(checkTeamPasswordRequest(postData));
    
    const results = await ClaretyApi.post('registration-teams/', postData, { storeId });
    const result = results[0];

    if (!result.errors) {
      dispatch(checkTeamPasswordSuccess(result));
      return true;
    } else {
      dispatch(checkTeamPasswordFailure(result));
      const errors = parseTeamErrors(result);
      dispatch(setErrors(errors));
      return false;
    }
  };
};

export const checkPromoCode = (promoCode) => {
  return async (dispatch, getState) => {
    dispatch(clearErrors());
    dispatch(setOrganisation(null));
    dispatch(checkPromoCodeRequest(promoCode));

    const results = await ClaretyApi.get('registration-promocode/', { promoCode });
    const result = results[0];

    if (result.corporateTeam) {
      result.team.isCorporateTeam = true;
      dispatch(setOrganisation(result.team));

      // Corporate teams use group channel.
      dispatch(updateAppSettings({ registrationMode: 'group' }));

      // No donations for corporate teams.
      dispatch(removePanels({ withComponent: 'DonationPanel' }));
      
      dispatch(checkPromoCodeSuccess(result));
      return true;
    } else if (result.valid) {
      dispatch(setPromoCode(promoCode));
      dispatch(checkPromoCodeSuccess(result));
      return true;
    } else {
      const errors = result.errors.map(error => ({
        field: 'promoCode',
        message: error,
      }));
      dispatch(setErrors(errors));
      dispatch(checkPromoCodeFailure(result));

      return false;
    }
  };
};


// Fetch

const fetchTeamRequest = (teamId) => ({
  type: types.fetchTeamRequest,
  teamId: teamId,
});

const fetchTeamSuccess = (result) => ({
  type: types.fetchTeamSuccess,
  result,
});

const fetchTeamFailure = (result) => ({
  type: types.fetchTeamFailure,
  result,
});

// Search

const searchTeamsRequest = (query) => ({
  type: types.searchTeamsRequest,
  query: query,
});

const searchTeamsSuccess = (results) => ({
  type: types.searchTeamsSuccess,
  results,
});

// Create

const createTeamRequest = (postData) => ({
  type: types.createTeamRequest,
  postData: postData,
});

const createTeamSuccess = (result) => ({
  type: types.createTeamSuccess,
  result,
});

const createTeamFailure = (result) => ({
  type: types.createTeamFailure,
  result,
});

// Check Password

const checkTeamPasswordRequest = (postData) => ({
  type: types.checkTeamPasswordRequest,
  postData: postData,
});

const checkTeamPasswordSuccess = (result) => ({
  type: types.checkTeamPasswordSuccess,
  result,
});

const checkTeamPasswordFailure = (result) => ({
  type: types.checkTeamPasswordFailure,
  result,
});

// Check Promo Code

const checkPromoCodeRequest = (promoCode) => ({
  type: types.checkPromoCodeRequest,
  promoCode: promoCode,
});

const checkPromoCodeSuccess = (result) => ({
  type: types.checkPromoCodeSuccess,
  result,
});

const checkPromoCodeFailure = (result) => ({
  type: types.checkPromoCodeFailure,
  result,
});
