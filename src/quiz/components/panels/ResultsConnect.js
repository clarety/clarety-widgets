import { getSetting } from 'shared/selectors';
import { getQuestions } from 'quiz/selectors';
import { submitQuiz } from 'quiz/actions';

export class ResultsConnect {
  static mapStateToProps = (state) => {
    return {
      questions: getQuestions(state),
      quizType: getSetting(state, 'quizType'),
      resultsOnly: getSetting(state, 'resultsOnly'),
    }
  };

  static actions = {
    submitQuiz: submitQuiz,
  };
}
