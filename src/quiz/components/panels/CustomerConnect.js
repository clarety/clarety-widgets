import { getFormData, getErrors, getSetting } from 'shared/selectors';
import { setErrors } from 'form/actions';
import { getIsBusy } from 'donate/selectors';
import { getQuestions } from 'quiz/selectors';
import { submitQuiz } from 'quiz/actions';

export class QuizCustomerConnect {
  static mapStateToProps = (state) => {
    return {
      quizType: getSetting(state, 'quizType'),
      questions: getQuestions(state),
      isBusy: getIsBusy(state),
      formData: getFormData(state),
      errors: getErrors(state),
      defaultCountry: getSetting(state, 'defaultCountry'),
    };
  };

  static actions = {
    onSubmit: () => async () => true,
    setErrors: setErrors,
  };
}
