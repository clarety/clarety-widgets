import { getFormData, getErrors } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy } from 'donate/selectors';
import { submitQuiz } from 'quiz/actions';

export class QuizCustomerConnect {
  static mapStateToProps = (state) => {
    return {
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
    };
  };

  static actions = {
    onSubmit: submitQuiz,
    setErrors: setErrors,
  };
}
