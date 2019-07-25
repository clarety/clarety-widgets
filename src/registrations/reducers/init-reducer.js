import { types } from 'registrations/actions';

const initialState = null;

export const initReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.initFetchSuccess:
      return convertSelectFields(action.result);

    default:
      return state;
  }
};

// Select field options are currently provided in a single object
// { 'QLD': 'Queensland', 'VIC': 'Victoria' }
// we want an array of objects containing values and labels
// [{ value: 'QLD', label: 'Queensland' }, { value: 'VIC', label: 'Victoria' }]
function convertSelectFields(init) {
  for (let form of init.extendForms) {
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

  return init;
}
