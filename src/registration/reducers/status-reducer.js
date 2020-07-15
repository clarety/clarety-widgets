import { types as sharedTypes, statuses } from 'shared/actions';
import { statusReducer as sharedStatusReducer } from 'shared/reducers';
import { types } from 'registration/actions';

const initialState = statuses.initializing;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case sharedTypes.setStatus:
      if (state === statuses.initializing && action.status === statuses.busy) {
        return statuses.initializing;
      }

      return action.status;

    case sharedTypes.fetchSettingsRequest:
    case types.fetchAuthCustomerRequest:
    case types.fetchEventsRequest:
    case types.fetchFullEventRequest:
      return statuses.initializing;
    
    case sharedTypes.fetchSettingsSuccess:
    case types.fetchAuthCustomerSuccess:
    case types.fetchEventsSuccess:
    case types.fetchFullEventSuccess:
      return statuses.ready;

    case types.registrationCreateRequest:
    case types.updateAuthCustomerRequest:
    case types.fetchShippingOptionsRequest:
      return statuses.validating;

    case types.registrationCreateSuccess:
    case types.registrationCreateFailure:
      return statuses.ready;

    case types.fetchShippingOptionsSuccess:
    case types.fetchShippingOptionsFailure:
      return statuses.ready;

    case types.updateShippingRequest:
      return statuses.initializing;

    case types.updateShippingSuccess:
    case types.updateShippingFailure:
      return statuses.ready;

    case types.registrationSubmitRequest:
      return statuses.submitting;

    case types.registrationSubmitFailure:
      return statuses.ready;

    default:
      return sharedStatusReducer(state, action);
  }
};
