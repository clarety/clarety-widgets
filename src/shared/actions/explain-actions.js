import { ClaretyApi } from 'clarety-utils';
import { types, statuses, setStatus } from 'shared/actions';

export const fetchExplain = (endpoint, params) => {
  return async dispatch => {
    dispatch(explainFetchRequest(endpoint));

    const results = await ClaretyApi.get(`widgets/${endpoint}`, params);
    const result = results[0];
    if (result) {
      dispatch(explainFetchSuccess(result));
      dispatch(setStatus(statuses.ready));
    } else {
      dispatch(explainFetchFailure());
    }
  };
};

export const setVariant = variant => ({
  type: types.setVariant,
  variant: variant,
});

const explainFetchRequest = endpoint => ({
  type: types.explainFetchRequest,
  endpoint,
});

const explainFetchSuccess = explain => ({
  type: types.explainFetchSuccess,
  explain,
});

const explainFetchFailure = () => ({
  type: types.explainFetchFailure,
});
