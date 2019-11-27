import React from 'react';
import { renderWidget, QuizWidget, setupQuizAxiosMock } from '../../src/';
import { CustomerPanel } from '../../src/shared/components';
import { QuestionPanel, QuestionConnect, QuizCustomerConnect, ResultsPanel, ResultsConnect } from '../../src/quiz/components';
import '../../src/quiz/style.scss';

window.renderQuizWidget = (props) => {
  initQuizWidget(props);

  renderWidget(props.elementId,
    <QuizWidget
      caseTypeUid={props.caseTypeUid}
      formId={props.formId}
      variant={props.variant}
      resultsOnly={props.resultsOnly}
      headingText={props.headingText}
      subHeadingText={props.subHeadingText}
      buttonText={props.buttonText}
      showOptIn={props.showOptIn}
      optInText={props.optInText}
      reCaptchaKey={props.reCaptchaKey}
    />
  );
};

const initQuizWidget = (props) => {
  QuizWidget.init(props);

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
};

export default class QuizDemo extends React.Component {
  componentWillMount() {
    setupQuizAxiosMock();
  }

  componentDidMount() {
    window.renderQuizWidget({
      elementId: 'quiz-widget-demo',
      // caseTypeUid: 'ctp_q6oq',
      formId: '123-form-id',
      variant: 'poll', // 'poll' || 'image-poll' || 'quiz' || etc...
      // resultsOnly: true,
      headingText: 'This is the heading',
      subHeadingText: 'This is the sub heading',
      buttonText: 'This is the button',
      showOptIn: '1',
      optInText: 'This is the opt in',
      reCaptchaKey: '...',
    });
  }

  render() {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col">
            <div id="quiz-widget-demo"></div>
          </div>
        </div>
      </div>
    );
  }
}
