import React from 'react';
import { QuizWidget } from '../../src/';
import { CustomerPanel } from '../../src/shared/components';
import { QuestionPanel, QuestionConnect, QuizCustomerConnect } from '../../src/quiz/components';
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
    settings: {
      title: 'This is the title',
      subtitle: 'This is the subtitle',
      submitBtnText: 'Button Text',
      showOptIn: true,
      optInText: 'This is the opt in',
    },
  },
]);

const QuizDemo = () => (
  <div className="container my-5">
    <div className="row">
      <div className="col">
        <QuizWidget
          formId="123-form-id"
          caseTypeUid="ctp_q6oq"
          reCaptchaKey="..."
        />
      </div>
    </div>
  </div>
);

export default QuizDemo;
