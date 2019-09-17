import { ClaretyApi, Config } from 'clarety-utils';
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

export const selectTeam = team => ({
  type: types.selectTeam,
  team: team,
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
