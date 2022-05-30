import { getSetting, getElement, getIsLoggedIn } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, setFormData } from 'form/actions';
import { getIsBusy } from 'donate/selectors';
import { submitCase, saveCase } from 'case/actions';

export class CaseFormConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      isBusySave: state.status === 'busy-save',
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
      form: getSetting(state, 'extendForm'),
      customerElement: getElement(state, 'customer'),
      shownFields: getSetting(state, 'shownFields'),
      requiredFields: getSetting(state, 'requiredFields'),
      fieldTypes: getSetting(state, 'fieldTypes'),
      showSaveBtn: getSetting(state, 'allowSave') && getIsLoggedIn(state),
      fetchedCustomer: getSetting(state, 'fetchedCustomer'),
      defaultCountry: getSetting(state, 'defaultCountry'),
      addressFinderKey: getSetting(state, 'addressFinderKey'),
      addressFinderCountry: getSetting(state, 'addressFinderCountry'),
    };
  };

  static actions = {
    onSubmit: submitCase,
    onSave: saveCase,
    setFormData: setFormData,
    setErrors: setErrors,
  };
}
