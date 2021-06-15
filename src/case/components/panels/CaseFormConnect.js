import { getSetting, getElement } from 'shared/selectors';
import { getFormData, getErrors } from 'form/selectors';
import { setErrors, setFormData } from 'form/actions';
import { getIsBusy } from 'donate/selectors';
import { createCase } from 'case/actions';

export class CaseFormConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      variant: getSetting(state, 'variant'),
      form: getSetting(state, 'extendForm'),
      customerElement: getElement(state, 'customer'),
    };
  };

  static actions = {
    onSubmit: createCase,
    setFormData: setFormData,
    setErrors: setErrors,
  };
}
