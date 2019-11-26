import { updateFormData } from 'form/actions';
import { getSetting } from 'shared/selectors';

export class QuestionConnect {
  static mapStateToProps = (state) => {
    return {
      quizType: getSetting(state, 'quizType'),
    };
  };

  static actions = {
    updateFormData: updateFormData,
  };
}
