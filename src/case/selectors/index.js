import { getSetting, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getSubmitCasePostData = (state) => {
  return {
    stage: getSetting(state, 'submitStage'),
    ...getCasePostData(state),
  };
};

export const getSaveCasePostData = (state) => {
  return {
    stage: getSetting(state, 'saveStage'),
    ...getCasePostData(state),
  };
};

const getCasePostData = (state) => {
  return {
    caseTypeUid: getSetting(state, 'caseTypeUid'),
    caseUid: getSetting(state, 'caseUid'),
    subject: getSetting(state, 'caseSubject'),
    variant: getSetting(state, 'variant'),
    ...getParsedFormData(state),
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
