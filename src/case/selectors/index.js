import { getSetting, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getCasePostData = (state) => {
  const caseTypeUid = getSetting(state, 'caseTypeUid');
  const caseStage = getSetting(state, 'caseStage');
  const variant = getSetting(state, 'variant');
  const formData = getParsedFormData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);

  return {
    caseTypeUid: caseTypeUid,
    stage: caseStage,
    variant: variant,
    ...formData,
    ...trackingData,
    recaptchaResponse: recaptcha,
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
