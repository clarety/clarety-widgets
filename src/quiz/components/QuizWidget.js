import React from 'react';
import { connect, Provider } from 'react-redux';
import { setStatus, setPanels, setClientIds, updateAppSettings, setTrackingData, fetchSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, configureStore } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { setupPanels } from 'quiz/actions';
import { rootReducer } from 'quiz/reducers';

const store = configureStore(rootReducer, true);

export class _QuizWidgetRoot extends React.Component {
  state = { isInitialising: true };

  async componentDidMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { updateAppSettings, setTrackingData, fetchSettings, setStatus, setupPanels } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      caseTypeUid: this.props.caseTypeUid,
      formId: this.props.formId,
      quizType: this.props.variant || 'quiz',
      resultsOnly: this.props.resultsOnly,
      confirmPageUrl: this.props.confirmPageUrl,
      variant: this.props.variant,
    });

    setTrackingData({
      sourceUid: this.props.sourceUid,
      responseId: this.props.responseId,
      emailResponseId: this.props.emailResponseId,
    });

    await fetchSettings('quiz/', { formId: this.props.formId });

    setupPanels(this.props);

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
  fetchSettings: fetchSettings,
  setupPanels: setupPanels,
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
