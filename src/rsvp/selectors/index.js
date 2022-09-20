import { getParsedFormData, getRecaptcha, getTrackingData } from 'shared/selectors';

export const getRsvpPostData = (state) => {  
  const formData = getParsedFormData(state);
  const recaptcha = getRecaptcha(state);
  const trackingData = getTrackingData(state);

  // Convert 'sessions' object into an array of UIDs,
  // and filter out any that were set to 'false'.
  const sessionUids = Object.keys(formData.sessions);
  const sessions = sessionUids.filter(sessionUid => !!formData.sessions[sessionUid]);

  return {
    sessions: sessions,
    customer: formData.customer,
    recaptchaResponse: recaptcha,
    ...formData.additionalData,
    ...trackingData,
  };
};
