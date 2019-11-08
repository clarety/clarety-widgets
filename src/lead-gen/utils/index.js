export const settingsMap = (result) => {
  const settings = {};

  const sos = result.sos || result.Sos;

  if (sos) {
    settings.sos = {
      current: Number(sos.actual),
      goal: Number(sos.goal),
    };
  }

  const download = result.download || result.Download;

  if (download) {
    settings.download = {
      image: download.coverImage,
      file: download.file,
    };
  }

  return settings;
};

export function getCustomerPanelSettingsFromWidgetProps(props) {
  return {
    title:             props.variant === 'sos' && props.headingText,
    subtitle:          props.variant === 'sos' && props.subHeadingText,
    submitBtnText:     props.buttonText,
    showOptIn:         props.showOptIn === '1',
    optInText:         props.optInText,
    phoneType:         getPhoneType(props.phoneOption),
    isPhoneRequired:   getIsPhoneRequired(props.phoneOption),
    addressType:       getAddressType(props.addressOption),
    isAddressRequired: getIsAddressRequired(props.addressOption),
  };
};

function getPhoneType(phoneOption) {
  if (phoneOption === 'mobile' || phoneOption === 'mobile_required') return 'mobile';

  return 'none';
}

function getIsPhoneRequired(phoneOption) {
  if (phoneOption === 'mobile_required') return true;

  return false;
}

function getAddressType(addressOption) {
  if (addressOption === 'postcode'      || addressOption === 'postcode_required')      return 'postcode';
  if (addressOption === 'australian'    || addressOption === 'australian_required')    return 'australian';
  if (addressOption === 'international' || addressOption === 'international_required') return 'international';

  return 'none';
}

function getIsAddressRequired(addressOption) {
  if (addressOption === 'postcode_required')      return true;
  if (addressOption === 'australian_required')    return true;
  if (addressOption === 'international_required') return true;

  return false;
}
