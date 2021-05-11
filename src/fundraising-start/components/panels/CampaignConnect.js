import { getFormData, getErrors, getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';

export class CampaignConnect {
  static mapStateToProps = (state) => {
    return {
      formData: getFormData(state),
      errors: getErrors(state),
      teamName: getSetting(state, 'teamName'),
    };
  };

  static actions = {
    setErrors: setErrors,
  };
}
