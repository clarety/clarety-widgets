import { getSetting, getParsedFormData, getTrackingData, getRecaptcha } from 'shared/selectors';
import { splitName } from 'shared/utils';

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

function convertFullName(formData) {
  const { firstName, lastName } = splitName(formData.customer.fullName);
  formData.customer.fullName = undefined;
  formData.customer.firstName = firstName;
  formData.customer.lastName = lastName;
}
