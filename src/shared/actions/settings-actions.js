import { ClaretyApi } from 'clarety-utils';
import { types, statuses, setStatus } from 'shared/actions';

export const fetchSettings = (endpoint, params) => {
  return async dispatch => {
    dispatch(fetchSettingsRequest(endpoint));

    const results = await ClaretyApi.get(`widgets/${endpoint}`, params);
    const result = results[0];

    if (result) {
      dispatch(fetchSettingsSuccess(result));
      dispatch(setStatus(statuses.ready));
    } else {
      dispatch(fetchSettingsFailure());
    }
  };
};

export const setVariant = variant => ({
  type: types.updateSettings,
  settings: {
    variant: variant,
  },
});

export const setConfirmPageUrl = confirmPageUrl => ({
  type: types.updateSettings,
  settings: {
    confirmPageUrl: confirmPageUrl,
  },
});

export const setAllowGuest = allowGuest => ({
  type: types.updateSettings,
  settings: {
    allowGuest: allowGuest,
  },
});


const fetchSettingsRequest = endpoint => ({
  type: types.fetchSettingsRequest,
  endpoint,
});

const fetchSettingsSuccess = result => ({
  type: types.fetchSettingsSuccess,
  result,
});

const fetchSettingsFailure = () => ({
  type: types.fetchSettingsFailure,
});
