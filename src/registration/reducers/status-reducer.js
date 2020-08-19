import { types as sharedTypes, statuses } from 'shared/actions';
import { statusReducer as sharedStatusReducer } from 'shared/reducers';
import { types } from 'registration/actions';

const initialState = statuses.initializing;

export const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    // Just keep 'initializing' status if trying to set 'busy' while already 'initializing'.
    case sharedTypes.setStatus:
      if (state === statuses.initializing && action.status === statuses.busy) {
        return statuses.initializing;
      }
      return action.status;

    // Initializing.
    case sharedTypes.fetchSettingsRequest:
    case types.fetchAuthCustomerRequest:
    case types.fetchEventsRequest:
    case types.fetchFullEventRequest:
    case types.checkPromoCodeRequest:
    case types.updateShippingRequest:
      return statuses.initializing;
    
    // Ready.
    case sharedTypes.fetchSettingsSuccess:
    case types.fetchAuthCustomerSuccess:
    case types.fetchEventsSuccess:
    case types.fetchFullEventSuccess:
    case types.checkPromoCodeSuccess:
    case types.checkPromoCodeFailure:
    case types.registrationCreateSuccess:
    case types.registrationCreateFailure:
    case types.updateShippingSuccess:
    case types.updateShippingFailure:
    case types.registrationSubmitFailure:
      return statuses.ready;

    // Validating.
    case types.registrationCreateRequest:
    case types.updateAuthCustomerRequest:
      return statuses.validating;
    
    // Submitting.
    case types.registrationSubmitRequest:
      return statuses.submitting;

    default:
      return sharedStatusReducer(state, action);
  }
};
