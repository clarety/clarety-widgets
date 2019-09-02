import { types } from '.';

export const updateFormData = formData => ({
  type: types.updateFormData,
  formData: formData,
});

export const resetFormData = () => ({
  type: types.resetFormData,
});

export const updateQtysFormData = qtys => {
  const formData = {};

  let participantIndex = 0;
  for (let [type, count] of Object.entries(qtys)) {
    for (let i = 0; i < count; i++) {
      formData[`participants[${participantIndex}].type`] = type;
      participantIndex++;
    }
  }

  return {
    type: types.updateFormData,
    formData: formData,
  };
};
