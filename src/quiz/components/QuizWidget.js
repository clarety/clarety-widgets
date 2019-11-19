import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { ClaretyApi } from 'clarety-utils';
import { setStatus, setAuth, setPanels, setClientIds, updateAppSettings, setTrackingData } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { fetchCustomer } from 'checkout/actions';
import { rootReducer } from 'quiz/reducers';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class _QuizWidgetRoot extends React.Component {
  state = { isInitialising: true };

  async componentDidMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { updateAppSettings, setTrackingData, setStatus, setAuth, fetchCustomer } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      formId: this.props.formId,
      caseTypeUid: this.props.caseTypeUid,
      formId: this.props.formId,
      confirmPageUrl: this.props.confirmPageUrl,
      variant: this.props.variant,
    });

    setTrackingData({
      sourceUid: this.props.sourceUid,
      responseId: this.props.responseId,
      emailResponseId: this.props.emailResponseId,
    });

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
  updateAppSettings: updateAppSettings,
  setTrackingData: setTrackingData,
  setStatus: setStatus,
  setAuth: setAuth,
  fetchCustomer: fetchCustomer,
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
