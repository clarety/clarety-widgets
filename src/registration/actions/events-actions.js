import { ClaretyApi, Config } from 'clarety-utils';
import { types } from 'registration/actions';

export const fetchEvents = () => {
  return async (dispatch, getState) => {
    const state = getState();

    dispatch(fetchEventsRequest());

    const { storeId, seriesId } = state.settings;
    const results = await ClaretyApi.get('registration-series-events/', { storeId, seriesId });
    const result = results[0];

    if (result) {
      dispatch(fetchEventsSuccess(result));
      return true;
    } else {
      dispatch(fetchEventsFailure());
      return false;
    }
  };
};

export const fetchFullEvent = eventId => {
  return async (dispatch, getState) => {
    const state = getState();

    dispatch(fetchFullEventRequest(eventId));

    const endpoint = Config.get('fullEventEndpoint') || 'registration-full/';
    const { storeId, seriesId } = state.settings;
    const results = await ClaretyApi.get(endpoint, { storeId, seriesId, eventId });

    if (results) {
      dispatch(fetchFullEventSuccess(results[0]));
      return true;
    } else {
      dispatch(fetchFullEventFailure());
      return false;
    }
  };
};

export const setPriceHandles = priceHandles => ({
  type: types.setPriceHandles,
  priceHandles: priceHandles,
});


// Fetch Events

const fetchEventsRequest = () => ({
  type: types.fetchEventsRequest,
});

const fetchEventsSuccess = results => ({
  type: types.fetchEventsSuccess,
  results,
});

const fetchEventsFailure = () => ({
  type: types.fetchEventsFailure,
});

// Fetch Full Event

const fetchFullEventRequest = eventId => ({
  type: types.fetchFullEventRequest,
  eventId: eventId,
});

const fetchFullEventSuccess = result => ({
  type: types.fetchFullEventSuccess,
  result: result,
});

const fetchFullEventFailure = () => ({
  type: types.fetchFullEventFailure,
});
