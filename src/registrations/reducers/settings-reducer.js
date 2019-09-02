import { types } from 'registrations/actions';

const initialState = {
  events: null,
  event: null,
  extendForms: null,
  elements: null,
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.fetchEventsSuccess:
      return {
        ...state,
        events: action.results,
      };

    case types.fetchFullEventSuccess:
      return {
        ...state,
        event: action.result.events[0],
        extendForms: convertSelectFields(action.result.extendForms),
        elements: action.result.elements,
      };

    default:
      return state;
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
