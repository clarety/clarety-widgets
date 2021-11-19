import React from 'react';
import { connect, Provider } from 'react-redux';
import i18next from 'i18next';
import { setStatus, setPanels, setClientIds, updateAppSettings, initTrackingData, fetchSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, configureStore } from 'shared/utils';
import { getIsResumed } from 'shared/selectors';
import { Recaptcha } from 'form/components';
import { setupPanels } from 'quiz/actions';
import { rootReducer } from 'quiz/reducers';
import { settingsMap } from 'quiz/utils';

export class QuizWidget extends React.Component {
  static store;
  static resources;

  static init(props) {
    // Setup store.
    const stateKey = `clarety-quiz-${props.quizUid}`;
    QuizWidget.store = configureStore(rootReducer, stateKey);
    QuizWidget.store.dispatch(updateAppSettings({ stateKey }));

    // Setup resources.
    QuizWidget.resources = new Resources();
  }

  static setClientIds({ dev, prod }) {
    QuizWidget.store.dispatch(setClientIds({ dev, prod }));
  }

  static setPanels(panels) {
    QuizWidget.resources.setPanels(panels);
    QuizWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    QuizWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <Provider store={QuizWidget.store}>
        <QuizWidgetRoot
          resources={QuizWidget.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _QuizWidgetRoot extends React.Component {
  state = { isInitialising: true };

  async componentDidMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { isResumed, updateAppSettings, initTrackingData, fetchSettings, setStatus, setupPanels } = this.props;

    // Translations.
    if (i18next.isInitialized) {
      i18next.on('languageChanged', (language) => {
        this.forceUpdate();
      });
    } else {
      // Use i18next without translation.
      await i18next.init();
    }

    updateAppSettings({
      widgetElementId: this.props.elementId,
      caseTypeUid: this.props.caseTypeUid,
      quizUid: this.props.quizUid,
      quizType: this.props.variant || 'quiz',
      resultsOnly: isResumed || this.props.resultsOnly,
      confirmPageUrl: this.props.confirmPageUrl,
      variant: this.props.variant,
    });

    initTrackingData(this.props);

    if (!isResumed) {
      await fetchSettings('quiz/', { quizUid: this.props.quizUid }, settingsMap);
    }

    setupPanels(this.props);

    setStatus('ready');
    this.setState({ isInitialising: false });
  }

  render() {
    const { variant, resources, reCaptchaKey } = this.props;

    // Show a loading indicator while we init.
    if (this.state.isInitialising) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className={`clarety-quiz-widget ${variant} h-100`}>
        <PanelManager layout="tabs" resources={resources} />
        <Recaptcha siteKey={reCaptchaKey} language={i18next.language} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isResumed: getIsResumed(state),
  };
};

const actions = {
  fetchSettings: fetchSettings,
  setupPanels: setupPanels,
  updateAppSettings: updateAppSettings,
  initTrackingData: initTrackingData,
  setStatus: setStatus,
};

const QuizWidgetRoot = connect(mapStateToProps, actions)(_QuizWidgetRoot);
