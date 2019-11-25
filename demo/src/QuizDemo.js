import React from 'react';
import { QuizWidget, setupQuizAxiosMock } from '../../src/';
import { CustomerPanel } from '../../src/shared/components';
import { QuestionPanel, QuestionConnect, QuizCustomerConnect, ResultsPanel, ResultsConnect } from '../../src/quiz/components';
import '../../src/quiz/style.scss';

QuizWidget.setClientIds({
  dev:  '82ee4a2479780256c9bf9b951f5d1cfb',
  prod: '',
});

QuizWidget.setPanels([
  {
    component: QuestionPanel,
    connect: QuestionConnect,
    settings: {},
  },
  {
    component: CustomerPanel,
    connect: QuizCustomerConnect,
    settings: {},
  },
  {
    component: ResultsPanel,
    connect: ResultsConnect,
    settings: {},
  },
]);

export default class QuizDemo extends React.Component {
  componentWillMount() {
    setupQuizAxiosMock();
  }

  render() {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col">
            <QuizWidget
              caseTypeUid="ctp_q6oq"
              formId="123-form-id"
              variant="poll" // "poll" || "image-poll" || "quiz" || etc...
              resultsOnly={true}

              // Customer Panel
              headingText="This is the heading"
              subHeadingText="This is the sub heading"
              buttonText="This is the button"
              showOptIn="1"
              optInText="This is the opt in"

              reCaptchaKey="..."
            />
          </div>
        </div>
      </div>
    );
  }
}
