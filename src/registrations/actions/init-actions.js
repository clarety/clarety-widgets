import { ClaretyApi, Config } from 'clarety-utils';
import { types, pushPanel, panels } from 'registrations/actions';

export const fetchInit = () => {
  return async dispatch => {
    dispatch(initFetchRequest());

    const seriesId = Config.get('seriesId');
    const storeId = Config.get('storeId');
    const endpoint = Config.get('initEndpoint') || 'registration-intl/';

    const result = await ClaretyApi.get(endpoint, { seriesId, storeId });

    if (result[0] && result[0].status !== 'error') {
      dispatch(initFetchSuccess(result[0]));
      dispatch(pushPanel({
        panel: panels.eventPanel,
        progress: 0,
      }));
    } else {
      dispatch(initFetchFailure());
    }
  };
};

const initFetchRequest = () => ({
  type: types.initFetchRequest,
});


const initFetchSuccess = result => ({
  type: types.initFetchSuccess,
  result,
});

const initFetchFailure = result => ({
  type: types.initFetchFailure,
  result,
});
