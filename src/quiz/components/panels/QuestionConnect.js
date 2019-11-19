import { updateFormData } from 'form/actions';

export class QuestionConnect {
  static mapStateToProps = (state) => {
    return {
      // TODO: pass a question in via props...
      question: {
        id: 'question1',
        title: 'What is your greatest concern?',
        options: [
          {
            label: 'Option One',
            value: 'option1',
            image: '//placeimg.com/420/315/animals',
          },
          {
            label: 'Option Two',
            value: 'option2',
            image: '//placeimg.com/420/315/animals?alt1',
          },
          {
            label: 'Option Three',
            value: 'option3',
            image: '//placeimg.com/420/315/animals?alt2',
          }
        ],
      },
    };
  };

  static actions = {
    updateFormData: updateFormData,
  };
}
