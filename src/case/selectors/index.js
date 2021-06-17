import { getSetting, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getCasePostData = (state) => {
  return {
    caseTypeUid: getSetting(state, 'caseTypeUid'),
    stage: getSetting(state, 'caseStage'),
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
