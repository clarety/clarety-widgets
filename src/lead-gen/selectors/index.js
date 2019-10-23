import { getCart, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getLeadPostData = (state) => {
  const caseTypeUid = getCaseTypeUid(state);
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

export const getCaseTypeUid = (state) => getCart(state).caseTypeUid;
