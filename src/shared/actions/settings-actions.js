import { ClaretyApi } from 'shared/utils/clarety-api';
import { types, statuses, setStatus } from 'shared/actions';

export const fetchSettings = (endpoint, params, map) => {
  return async dispatch => {
    dispatch(fetchSettingsRequest(endpoint));

    const results = await ClaretyApi.get(`widgets/${endpoint}`, params);
    const result = map ? map(results[0]) : results[0];

    if (result) {
      dispatch(fetchSettingsSuccess(result));
      dispatch(setStatus(statuses.ready));
    } else {
      dispatch(fetchSettingsFailure());
    }
  };
};

export const setPanelSettings = (component, settings) => ({
  type: types.updatePanelSettings,
  component: component,
  settings: settings,
});

export const updateAppSettings = (settings) => ({
  type: types.updateSettings,
  settings: settings,
});

export const setClientIds = ({ dev, prod }) => ({
  type: types.updateSettings,
  settings: {
    devClientId: dev,
    prodClientId: prod,
  },
});


const fetchSettingsRequest = (endpoint) => ({
  type: types.fetchSettingsRequest,
  endpoint,
});

const fetchSettingsSuccess = (result) => ({
  type: types.fetchSettingsSuccess,
  result,
});

const fetchSettingsFailure = () => ({
  type: types.fetchSettingsFailure,
});
