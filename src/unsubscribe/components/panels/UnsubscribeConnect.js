import { getFormData, getErrors, getStatus, getTrackingData } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { unsubscribe } from 'unsubscribe/actions';

export class UnsubscribeConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getStatus(state) !== 'ready',
      formData: getFormData(state),
      errors: getErrors(state),
      trackingData: getTrackingData(state),
    };
  };

  static actions = {
    onSubmit: unsubscribe,
    setErrors: setErrors,
  };
}
