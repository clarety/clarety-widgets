import { getFormData, getErrors, getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';

export class CampaignConnect {
  static mapStateToProps = (state) => {
    return {
      formData: getFormData(state),
      errors: getErrors(state),
      isJoiningTeam: !!getSetting(state, 'teamId'),
    };
  };

  static actions = {
    setErrors: setErrors,
  };
}
