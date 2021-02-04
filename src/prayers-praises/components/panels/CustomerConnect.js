import { getFormData, getErrors } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy } from 'donate/selectors';
import { createPrayerPraise } from 'prayers-praises/actions';

export class CustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
    };
  };

  static actions = {
    onSubmit: createPrayerPraise,
    setErrors: setErrors,
  };
}
