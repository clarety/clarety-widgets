import { updateFormData } from 'form/actions';
import { getSetting, getFormData } from 'shared/selectors';

export class QuestionConnect {
  static mapStateToProps = (state) => {
    return {
      quizType: getSetting(state, 'quizType'),
      quizName: getSetting(state, 'quizName'),
      questions: getSetting(state, 'questions'),
      formData: getFormData(state),
    };
  };

  static actions = {
    updateFormData: updateFormData,
  };
}
