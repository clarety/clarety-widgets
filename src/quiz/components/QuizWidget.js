import React from 'react';
import { connect, Provider } from 'react-redux';
import { setStatus, setPanels, setClientIds, updateAppSettings, setTrackingData } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, configureStore } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { setQuestions, setupCustomerPanel } from 'quiz/actions';
import { rootReducer } from 'quiz/reducers';

const store = configureStore(rootReducer);

export class _QuizWidgetRoot extends React.Component {
  state = { isInitialising: true };

  async componentDidMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { updateAppSettings, setTrackingData, setStatus, setQuestions, setupCustomerPanel } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      caseTypeUid: this.props.caseTypeUid,
      formId: this.props.formId,
      quizType: this.props.quizType,
      resultsOnly: this.props.resultsOnly,
      confirmPageUrl: this.props.confirmPageUrl,
      variant: this.props.variant,
    });

    setTrackingData({
      sourceUid: this.props.sourceUid,
      responseId: this.props.responseId,
      emailResponseId: this.props.emailResponseId,
    });

    setupCustomerPanel(this.props);

    // TODO: load questions from API...
    setQuestions([
      {
        id: 'question1',
        title: 'What is your greatest concern?',
        totalVotes: 70,
        options: [
          {
            label: 'Option One',
            value: 'option1',
            image: '//placeimg.com/420/315/animals?alt1',
            votes: 10,
            isCorrect: false,
          },
          {
            label: 'Option Two',
            value: 'option2',
            image: '//placeimg.com/420/315/animals?alt2',
            votes: 40,
            isCorrect: false,
          },
          {
            label: 'Option Three',
            value: 'option3',
            image: '//placeimg.com/420/315/animals?alt3',
            votes: 20,
            isCorrect: false,
          }
        ],
      },
      {
        id: 'question2',
        title: 'What is the airspeed velocity of an unladen swallow?',
        totalVotes: 123,
        options: [
          {
            label: 'Option One',
            value: 'option1',
            image: '//placeimg.com/420/315/animals?alt4?',
            votes: 100,
            isCorrect: false,
          },
          {
            label: 'Option Two',
            value: 'option2',
            image: '//placeimg.com/420/315/animals?alt5',
            votes: 3,
            isCorrect: false,
          },
          {
            label: 'Option Three',
            value: 'option3',
            image: '//placeimg.com/420/315/animals?alt6',
            votes: 20,
            isCorrect: false,
          }
        ],
      },
    ]);

    setStatus('ready');
    this.setState({ isInitialising: false });
  }

  render() {
    // Show a loading indicator while we init.
    if (this.state.isInitialising) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-quiz-widget h-100">
        <PanelManager layout="tabs" />
        <Recaptcha siteKey={this.props.reCaptchaKey} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const actions = {
  setQuestions: setQuestions,
  setupCustomerPanel: setupCustomerPanel,
  updateAppSettings: updateAppSettings,
  setTrackingData: setTrackingData,
  setStatus: setStatus,
};

const QuizWidgetRoot = connect(mapStateToProps, actions)(_QuizWidgetRoot);

export class QuizWidget extends React.Component {
  static setPanels(panels) {
    Resources.setPanels(panels);
    store.dispatch(setPanels(panels));
  }

  static setClientIds({ dev, prod }) {
    store.dispatch(setClientIds({ dev, prod }));
  }

  render() {
    return (
      <Provider store={store}>
        <QuizWidgetRoot {...this.props} />
      </Provider>
    );
  }
}
