import { getSetting, getFormData, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';
import { parseNestedElements } from 'shared/utils';
import { fieldMeetsDisplayCondition } from 'case/utils';

export const getSubmitCasePostData = (state) => {
  return {
    stage: getSetting(state, 'submitStage'),
    ...getCasePostData(state),
  };
};

export const getSaveCasePostData = (state) => {
  return {
    inProgress: true,
    stage: getSetting(state, 'saveStage'),
    ...getCasePostData(state),
  };
};

const getCasePostData = (state) => {
  return {
    storeUid: getSetting(state, 'storeUid'),
    caseTypeUid: getSetting(state, 'caseTypeUid'),
    caseUid: getSetting(state, 'caseUid'),
    eventUid: getSetting(state, 'eventUid'),
    subject: getSetting(state, 'caseSubject'),
    variant: getSetting(state, 'variant'),
    ...getCaseFormData(state),
    ...getTrackingData(state),
    recaptchaResponse: getRecaptcha(state),
  };
};

export const getCmsConfirmContentFields = (state) => {
  const formData = getParsedFormData(state);

  return [
    {
      match: /##firstname##/g,
      value: formData.customer.firstName,
    }
  ];
};

function getCaseFormData(state) {
  const extendForm = getSetting(state, 'extendForm');
  const caseFormFields = extendForm ? extendForm.extendFields : [];

  const allFormData = { ...getFormData(state) };
  const fieldData = removeHiddenFieldData(caseFormFields, allFormData);
  
  return parseNestedElements(fieldData);
}

function removeHiddenFieldData(formFields, formData) {
  for (const field of formFields) {
    if (!fieldMeetsDisplayCondition(field, formData, formFields)) {
      const fieldKey = `extendFields.${field.columnKey}`;
      delete formData[fieldKey];
    }
  }

  return formData;
}

export function getCaseRequiresPayment(state) {
  return !!getSetting(state, 'offerUid');
}
