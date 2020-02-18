import { getFormData } from 'form/selectors';
import { getIsBusy } from 'donate/selectors';
import { makePayment } from 'donate/actions';

export class SubmitConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
    };
  };

  static actions = {
    onSubmit: makePayment,
  };
}
