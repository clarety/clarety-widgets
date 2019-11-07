import { getSetting, getParsedFormData, getTrackingData, getRecaptcha, getCurrentPanelComponentName } from 'shared/selectors';

export const getLeadPostData = (state) => {
  const variant = getSetting(state, 'variant');
  const caseTypeUid = getSetting(state, 'caseTypeUid');
  const formData = getParsedFormData(state);
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);

  return {
    variant: variant,
    caseTypeUid: caseTypeUid,
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

export const getIsShowingConfirmation = (state) => getSetting(state, 'isShowingConfirmation');
