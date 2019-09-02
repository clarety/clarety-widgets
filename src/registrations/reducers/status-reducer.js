import { statuses, types } from 'registrations/actions';

const initialState = statuses.initializing;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchEventsRequest:
      return statuses.initializing;

    case types.fetchEventsSuccess:
      return statuses.ready;

    case types.fetchFullEventRequest:
      return statuses.fetchingEvent;

    case types.fetchFullEventSuccess:
      return statuses.ready;

    case types.registrationCreateRequest:
      return statuses.validating;

    case types.registrationCreateSuccess:
    case types.registrationCreateFailure:
      return statuses.ready;

    case types.registrationSubmitRequest:
      return statuses.submitting;

    case types.registrationSubmitFailure:
      return statuses.ready;

    default:
      return state;
  }
};
