import { types } from 'registration/actions';
import { initialState as sharedInitialState } from 'shared/reducers';
import { settingsReducer as sharedSettingsReducer } from 'shared/reducers';

const initialState = {
  ...sharedInitialState,

  isBusy: false,

  events: null,
  event: null,

  extendForms: null,
  elements: null,

  priceHandles: null,

  currency: {
    symbol: '$',
    code: 'AUD',
  },
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchEventsSuccess:
      return {
        ...state,
        events: action.results,
      };

    case types.fetchFullEventRequest:
      return {
        ...state,
        isBusy: true,
      };

    case types.fetchFullEventSuccess:
      return {
        ...state,
        isBusy: false,
        event: action.result.events[0],
        extendForms: convertSelectFields(action.result.extendForms),
        elements: action.result.elements,
      };

    case types.setPriceHandles:
      return {
        ...state,
        priceHandles: action.priceHandles,
      };

    default:
      return sharedSettingsReducer(state, action);
  }
};

// Select field options are currently provided in a single object
// { 'QLD': 'Queensland', 'VIC': 'Victoria' }
// we want an array of objects containing values and labels
// [{ value: 'QLD', label: 'Queensland' }, { value: 'VIC', label: 'Victoria' }]
function convertSelectFields(extendForms) {
  for (let form of extendForms) {
    for (let field of form.extendFields) {
      // Check if field has an options object.
      if (field.options && typeof field.options === 'object') {
        // Map options to an array of values and labels.
        field.options = Object.entries(field.options).map(
          ([key, value]) => ({ value: key, label: value })
        );
      }
    }
  }

  return extendForms;
}
