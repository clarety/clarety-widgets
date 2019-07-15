import { ClaretyApi } from 'shared/services';
import { types, statuses, setStatus } from 'shared/actions';

export const fetchExplain = (endpoint, params) => {
  return async dispatch => {
    dispatch(explainFetchRequest(endpoint));

    const explain = await ClaretyApi.explain(endpoint, params);
    if (explain) {
      dispatch(explainFetchSuccess(explain));
      dispatch(setStatus(statuses.ready));
    } else {
      dispatch(explainFetchFailure());
    }
  };
};

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
