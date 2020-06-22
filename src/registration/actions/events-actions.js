import { types } from 'registration/actions';
import { RegistrationApi } from 'registration/utils';

export const fetchEvents = () => {
  return async (dispatch, getState) => {
    dispatch(fetchEventsRequest());

    const events = await RegistrationApi.fetchEvents();

    if (events) {
      dispatch(fetchEventsSuccess(events));
      return true;
    } else {
      dispatch(fetchEventsFailure());
      return false;
    }
  };
};

export const fetchFullEvent = (eventId) => {
  return async (dispatch, getState) => {
    dispatch(fetchFullEventRequest(eventId));

    const event = await RegistrationApi.fetchEvent(eventId);

    if (event) {
      dispatch(fetchFullEventSuccess(event));
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
