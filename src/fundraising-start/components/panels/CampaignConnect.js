import { getFormData, getErrors } from 'shared/selectors';
import { setErrors } from 'form/actions';

export class CampaignConnect {
  static mapStateToProps = (state) => {
    return {
      formData: getFormData(state),
      errors: getErrors(state),
    };
  };

  static actions = {
    setErrors: setErrors,
  };
}
