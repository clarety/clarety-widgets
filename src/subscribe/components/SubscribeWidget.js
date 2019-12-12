import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { PanelManager } from 'shared/components';
import { setPanels, fetchSettings, updateAppSettings, setTrackingData, setPanelSettings } from 'shared/actions';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { rootReducer } from 'subscribe/reducers';

const middleware = applyMiddleware(thunkMiddleware);
const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(middleware));

export class _SubscribeRoot extends React.Component {
  async componentDidMount() {
    const { updateAppSettings, setPanelSettings, setTrackingData } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      caseTypeUid: this.props.caseTypeUid,
      confirmPageUrl: this.props.confirmPageUrl,
    });

    setPanelSettings('CustomerPanel', {
      nameOption: this.props.nameOption,
      buttonText: this.props.buttonText,
    });

    const { sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceUid, responseId, emailResponseId });

    await this.props.fetchSettings('subscriptions/');
  }

  render() {
    const { status, reCaptchaKey } = this.props;

    // Show a loading indicator while we init.
    if (status === 'initializing') {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-subscribe-widget h-100">
        <PanelManager layout="tabs" />
        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
    elements: state.elements,
    formData: state.formData,
  };
};

const actions = {
  updateAppSettings: updateAppSettings,
  setPanelSettings: setPanelSettings,
  setTrackingData: setTrackingData,
  fetchSettings: fetchSettings,
};

const SubscribeRoot = connect(mapStateToProps, actions)(_SubscribeRoot);

export class SubscribeWidget extends React.Component {
  static setPanels(panels) {
    Resources.setPanels(panels);
    store.dispatch(setPanels(panels));
  }

  render() {
    return (
      <Provider store={store}>
        <SubscribeRoot {...this.props} />
      </Provider>
    );
  }
}
