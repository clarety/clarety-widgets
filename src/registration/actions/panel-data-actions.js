import { types } from 'registration/actions';
import { getCustomer, getPreviousParticipants } from 'registration/selectors';

export const setQtys = (qtys) => ({
  type: types.panelDataSetQtys,
  qtys: qtys,
});

export const resetQtys = () => ({
  type: types.panelDataResetQtys,
});

export const setFirstNames = (firstNames) => ({
  type: types.panelDataSetFirstNames,
  firstNames: firstNames,
});

export const resetFirstNames = () => ({
  type: types.panelDataResetFirstNames,
});

export const setOffers = (offers) => ({
  type: types.panelDataSetOffers,
  offers: offers,
});

export const resetOffers = () => ({
  type: types.panelDataResetOffers,
});

export const prefillDetails = (prefills) => {
  return (dispatch, getState) => {
    const state = getState();
    const customer = getCustomer(state);
    const previous = getPreviousParticipants(state);

    prefills.forEach((prefill, index) => {
      if (prefill === 'other') {
        dispatch(resetDetails(index));
      }

      if (prefill === 'yourself') {
        dispatch(setDetails(index, customer, {}));
      }
      
      const participant = previous.find(prev => prev.id === prefill);
      if (participant) {
        dispatch(setDetails(index, participant, {}));
      }
    });
  };
};

export const setDetails = (index, customerForm, extendForm) => ({
  type: types.panelDataSetDetails,
  index: index,
  customerForm: customerForm,
  extendForm: extendForm,
});

export const setAdditionalData = (index, additionalData) => ({
  type: types.panelDataSetAdditionalData,
  index: index,
  additionalData: additionalData,
});

export const updateAddOn = (index, addOn, isSelected) => ({
  type: isSelected ? types.panelDataSelectAddOn : types.panelDataDeselectAddOn,
  index: index,
  addOn: addOn,
});

export const setErrors = (index, errors) => ({
  type: types.panelDataSetErrors,
  index: index,
  errors: errors,
});

export const resetDetails = (index) => ({
  type: types.panelDataResetDetails,
  index: index,
});
