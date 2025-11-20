export function getDefaultOfferPaymentUid(offer) {
  if (offer.offerPaymentUid) {
    return offer.offerPaymentUid;
  }

  if (offer.schedules && offer.schedules.length) {
    const defaultSchedule = offer.schedules.find((schedule) => schedule.default);
    return defaultSchedule
      ? defaultSchedule.offerPaymentUid
      : offer.schedules[0].offerPaymentUid;
  }

  return undefined;
}

export function getCustomerPanelSettingsFromWidgetProps(props) {
  return {
    title:             props.headingText,
    subtitle:          props.subHeadingText,
    submitBtnText:     props.buttonText,

    showOptIn:         props.showOptIn === '1',
    optInText:         props.optInText,

    phoneType:         getPhoneType(props.phoneOption),
    isPhoneRequired:   getIsPhoneRequired(props.phoneOption),

    addressType:       getAddressType(props.addressOption),
    isAddressRequired: getIsAddressRequired(props.addressOption),

    showDetails:       getShowDetails(props.detailsOption),
    isDetailsRequired: getIsDetailsRequired(props.detailsOption),
    detailsText:       props.detailsText,

    showDob:           getShowDob(props.dobOption),
    requireDob:        getIsDobRequired(props.dobOption),
  };
};

function getPhoneType(phoneOption) {
  if (phoneOption === 'mobile' || phoneOption === 'mobile_required') return 'mobile';

  return 'none';
}

function getIsPhoneRequired(phoneOption) {
  return phoneOption === 'mobile_required';
}

function getAddressType(addressOption) {
  if (addressOption === 'postcode'      || addressOption === 'postcode_required')      return 'postcode';
  if (addressOption === 'state'         || addressOption === 'state_required')         return 'state';
  if (addressOption === 'australian'    || addressOption === 'australian_required')    return 'australian';
  if (addressOption === 'international' || addressOption === 'international_required') return 'international';

  return 'none';
}

function getIsAddressRequired(addressOption) {
  if (addressOption === 'postcode_required')      return true;
  if (addressOption === 'state_required')         return true;
  if (addressOption === 'australian_required')    return true;
  if (addressOption === 'international_required') return true;

  return false;
}

function getShowDetails(detailsOption) {
  return detailsOption === 'optional' || detailsOption === 'required';
}

function getIsDetailsRequired(detailsOption) {
  return detailsOption === 'required';
}

function getShowDob(dobOption) {
  return dobOption === 'dob' || dobOption === 'dob_required';
}

function getIsDobRequired(dobOption) {
  return dobOption === 'dob_required';
}
