import React from 'react';
import { renderWidget, QuizWidget, initTranslations } from '../../src/';
import { CustomerPanel } from '../../src/shared/components';
import { QuestionPanel, QuestionConnect, QuizCustomerConnect, ResultsPanel, ResultsConnect } from '../../src/quiz/components';
import './styles/quiz.css';

initTranslations({
  translationsPath: 'translations/{{lng}}.json',
  defaultLanguage: 'en',
});

window.renderQuizWidget = (props) => {
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

  renderWidget(props.elementId,
    <QuizWidget {...props} />
  );
};

export default class QuizDemo extends React.Component {
  componentDidMount() {
    window.renderQuizWidget({
      elementId: 'quiz-widget-demo',
      quizUid: 'quz_l2rn',
      variant: 'quiz', // 'poll' || 'image-poll' || 'quiz' || etc...
      caseTypeUid: 'ctp_r563',
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
