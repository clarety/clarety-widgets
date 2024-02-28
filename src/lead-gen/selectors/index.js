import { getSetting, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getLeadPostData = (state) => {
  const formData = getParsedFormData(state);
  const trackingData = getTrackingData(state);

  return {
    caseTypeUid: getSetting(state, 'caseTypeUid'),
    stage: getSetting(state, 'caseStage'),
    variant: getSetting(state, 'variant'),
    confirmActionAuth: getSetting(state, 'confirmActionAuth'),
    ...formData,
    ...trackingData,
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

export const getIsShowingConfirmation = (state) => getSetting(state, 'isShowingConfirmation');
