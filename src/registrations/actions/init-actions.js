import { ClaretyApi, Config } from 'clarety-utils';
import { types, pushPanel, panels } from 'registrations/actions';

export const fetchEvents = () => {
  return async dispatch => {
    dispatch(fetchEventsRequest());

    const storeId  = Config.get('storeId');
    const seriesId = Config.get('seriesId');
    const results = await ClaretyApi.get('registration-events/', { storeId, seriesId });

    if (results) {
      dispatch(fetchEventsSuccess(results));
      dispatch(pushPanel({
        panel: panels.eventPanel,
        progress: 0,
      }));
    } else {
      dispatch(fetchEventsFailure());
    }
  };
};

export const fetchFullEvent = eventId => {
  return async dispatch => {
    dispatch(fetchFullEventRequest(eventId));

    const endpoint = Config.get('fullEventEndpoint') || 'registration-full/';
    const storeId  = Config.get('storeId');
    const seriesId = Config.get('seriesId');
    const results = await ClaretyApi.get(endpoint, { storeId, seriesId, eventId });

    if (results) {
      dispatch(fetchFullEventSuccess(results[0]));
      dispatch(pushPanel({
        panel: panels.qtysPanel,
        progress: 20,
      }));
    } else {
      dispatch(fetchFullEventFailure());
    }
  };
};


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
