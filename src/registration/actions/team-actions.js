import { ClaretyApi, Config } from 'clarety-utils';
import { setErrors, clearErrors } from 'form/actions';
import { getCreateTeamPostData } from 'registration/selectors';
import { parseTeamErrors } from 'registration/utils';
import { types } from 'registration/actions';

export const searchTeams = query => {
  return async (dispatch, getState) => {
    dispatch(searchTeamsRequest(query));

    const storeId = Config.get('storeId');
    const seriesId = Config.get('seriesId');
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
    
    const storeId = Config.get('storeId');
    const results = await ClaretyApi.post('registration-teams/', postData, { storeId });
    const result = results[0];

    if (!result.errors) {
      const team = await dispatch(fetchTeam(result.teamId));
      dispatch(selectTeam(team));
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

export const fetchTeam = teamId => {
  return async (dispatch, getState) => {
    dispatch(fetchTeamRequest(teamId));

    const storeId = Config.get('storeId');
    const seriesId = Config.get('seriesId');
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
    const storeId = Config.get('storeId');
    const seriesId = Config.get('seriesId');

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

export const selectTeam = team => ({
  type: types.selectTeam,
  team: team,
});

export const setTeamPanelMode = mode => ({
  type: types.setTeamPanelMode,
  mode: mode,
});


// Fetch

const fetchTeamRequest = teamId => ({
  type: types.fetchTeamRequest,
  teamId: teamId,
});

const fetchTeamSuccess = result => ({
  type: types.fetchTeamSuccess,
  result,
});

const fetchTeamFailure = result => ({
  type: types.fetchTeamFailure,
  result,
});

// Search

const searchTeamsRequest = query => ({
  type: types.searchTeamsRequest,
  query: query,
});

const searchTeamsSuccess = results => ({
  type: types.searchTeamsSuccess,
  results,
});

// Create

const createTeamRequest = postData => ({
  type: types.createTeamRequest,
  postData: postData,
});

const createTeamSuccess = result => ({
  type: types.createTeamSuccess,
  result,
});

const createTeamFailure = result => ({
  type: types.createTeamFailure,
  result,
});

// Check Password

const checkTeamPasswordRequest = postData => ({
  type: types.checkTeamPasswordRequest,
  postData: postData,
});

const checkTeamPasswordSuccess = result => ({
  type: types.checkTeamPasswordSuccess,
  result,
});

const checkTeamPasswordFailure = result => ({
  type: types.checkTeamPasswordFailure,
  result,
});