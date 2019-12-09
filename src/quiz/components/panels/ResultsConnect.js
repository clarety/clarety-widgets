import { getSetting, getFormData } from 'shared/selectors';
import { getQuestions } from 'quiz/selectors';
import { submitQuiz } from 'quiz/actions';

export class ResultsConnect {
  static mapStateToProps = (state) => {
    return {
      questions: getQuestions(state),
      quizType: getSetting(state, 'quizType'),
      resultsOnly: getSetting(state, 'resultsOnly'),
      formData: getFormData(state),
    }
  };

  static actions = {
    submitQuiz: submitQuiz,
  };
}
