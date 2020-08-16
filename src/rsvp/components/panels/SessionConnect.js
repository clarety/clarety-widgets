import { getFormData, getErrors, getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';

export class SessionConnect {
  static mapStateToProps = (state) => {
    return {
      sessions: getSetting(state, 'sessions'),
      formData: getFormData(state),
      errors: getErrors(state),
    };
  };

  static actions = {
    setErrors: setErrors,
  };
}
