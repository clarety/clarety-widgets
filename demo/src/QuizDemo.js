import React from 'react';
import { QuizWidget } from '../../src/';
import { QuestionPanel, QuestionConnect } from '../../src/quiz/components';
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
]);

const QuizDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">
        <QuizWidget
          formId="123"
          reCaptchaKey="..."
        />
      </div>
    </div>
  </div>
);

export default QuizDemo;
