import { ClaretyApi, Config } from 'clarety-utils';
import { setErrors } from 'form/actions';
import { types } from 'registrations/actions';

export const searchTeams = query => {
  return async (dispatch, getState) => {
    dispatch(searchTeamsRequest(query));

    const storeId = Config.get('storeId');
    const seriesId = Config.get('seriesId');
    const results = await ClaretyApi.get('registration-teams/', { query, seriesId, storeId });
    
    dispatch(searchTeamsSuccess(results));
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

    dispatch(checkTeamPasswordRequest(postData));
    
    const results = await ClaretyApi.post('registration-teams/', postData, { storeId });
    const result = results[0];

    if (result.errors === null) {
      dispatch(checkTeamPasswordSuccess(result));

    } else {
      dispatch(checkTeamPasswordFailure(result));

      // NOTE: The API returns an error that doesn't match our format, so just create our own.
      // TODO: This needs to be translated...
      const errors = [{
        field: 'team.password',
        message: 'Incorrect password',
      }];
      dispatch(setErrors(errors));
    }
  };
};

export const selectTeam = team => ({
  type: types.selectTeam,
  team: team,
});

export const setTeamPanelStatus = status => ({
  type: types.setTeamPanelStatus,
  status: status,
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
