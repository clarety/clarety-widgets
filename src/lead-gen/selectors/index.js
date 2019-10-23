import { getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getLeadPostData = (state) => {
  const formData = getParsedFormData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);

  return {
    ...formData,
    ...trackingData,
    recaptchaResponse: recaptcha,
  };
};
