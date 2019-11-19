import { getSetting, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getQuizPostData = (state) => {
  const caseTypeUid = getSetting(state, 'caseTypeUid');
  const formData = getParsedFormData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);

  return {
    caseTypeUid: caseTypeUid,
    ...formData,
    ...trackingData,
    recaptchaResponse: recaptcha,
  };
};
