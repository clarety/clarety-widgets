import { types } from 'registration/actions';
import { getCustomer, getPreviousParticipants } from 'registration/selectors';

export const setQtys = (qtys) => ({
  type: types.setParticipantQtys,
  qtys: qtys,
});

export const resetQtys = () => ({
  type: types.resetParticipantQtys,
});

export const setFirstNames = (firstNames) => ({
  type: types.setParticipantFirstNames,
  firstNames: firstNames,
});

export const resetFirstNames = () => ({
  type: types.resetParticipantFirstNames,
});

export const setOffers = (offers) => ({
  type: types.setParticipantOffers,
  offers: offers,
});

export const resetOffers = () => ({
  type: types.resetParticipantOffers,
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

export const setDetails = (index, customerForm, extendForm, waveProductId) => ({
  type: types.setParticipantDetails,
  index: index,
  customerForm: customerForm,
  extendForm: extendForm,
  waveProductId: waveProductId,
});

export const resetDetails = (index) => ({
  type: types.resetParticipantDetails,
  index: index,
});

export const setAdditionalData = (index, additionalData) => ({
  type: types.setParticipantAdditionalData,
  index: index,
  additionalData: additionalData,
});

export const updateAddOn = (index, addOn, isSelected) => ({
  type: isSelected ? types.selectParticipantAddOn : types.deselectParticipantAddOn,
  index: index,
  addOn: addOn,
});

export const setErrors = (index, errors) => ({
  type: types.setParticipantErrors,
  index: index,
  errors: errors,
});
