import { getSetting, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';

export const getSubscribePostData = (state) => {
  const caseTypeUid = getSetting(state, 'caseTypeUid');
  const caseStage = getSetting(state, 'caseStage');
  const formData = getParsedFormData(state);
  const nameOption = getSetting(state, 'nameOption');
  const trackingData = getTrackingData(state);
  const recaptcha = getRecaptcha(state);

  if (nameOption === 'full') convertFullName(formData);

  // Some instances don't use the optIn field, and instead
  // let the case activities handle the newsletter circle.
  const optIn = getSetting(state, 'dropOptInField') ? false : true;

  return {
    caseTypeUid: caseTypeUid,
    stage: caseStage,
    optIn: optIn,
    ...formData,
    ...trackingData,
    recaptchaResponse: recaptcha,
  };
};

export const getCmsConfirmContentFields = (state) => {
  const formData = getParsedFormData(state);
  const nameOption = getSetting(state, 'nameOption');

  if (nameOption === 'full') convertFullName(formData);

  return [
    {
      match: /##firstname##/g,
      value: formData.customer.firstName,
    }
  ];
};

const convertFullName = (formData) => {
  const fullName = (formData.customer.fullName || '').trim();
  formData.customer.fullName = undefined;

  // Split full name into first and last.
  const index = fullName.lastIndexOf(' ') + 1;
  formData.customer.firstName = (index !== 0) ? fullName.substring(0, index - 1) : fullName;
  formData.customer.lastName  = (index !== 0) ? fullName.substring(index, fullName.length) : '';
};
