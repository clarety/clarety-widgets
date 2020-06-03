import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { PanelManager } from 'shared/components';
import { setPanels, fetchSettings, updateAppSettings, setTrackingData, setPanelSettings } from 'shared/actions';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { rootReducer } from 'subscribe/reducers';

export class SubscribeWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const middleware = applyMiddleware(thunkMiddleware);
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    SubscribeWidget.store = createStore(rootReducer, composeDevTools(middleware));

    // Setup resources.
    SubscribeWidget.resources = new Resources();
  }

  static setPanels(panels) {
    SubscribeWidget.resources.setPanels(panels);
    SubscribeWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    SubscribeWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <Provider store={SubscribeWidget.store}>
        <SubscribeWidgetRoot
          resources={SubscribeWidget.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _SubscribeWidgetRoot extends React.Component {
  async componentDidMount() {
    const { updateAppSettings, setPanelSettings, setTrackingData } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      caseTypeUid: this.props.caseTypeUid,
      confirmPageUrl: this.props.confirmPageUrl,
      reCaptchaKey: this.props.reCaptchaKey,
    });

    setPanelSettings('CustomerPanel', {
      nameOption: this.props.nameOption,
      buttonText: this.props.buttonText,
      showCountry: this.props.showCountry,
    });

    const { sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceUid, responseId, emailResponseId });

    await this.props.fetchSettings('subscriptions/');
  }

  render() {
    const { status, resources, reCaptchaKey } = this.props;

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
        <PanelManager layout="tabs" resources={resources} />
        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
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

const SubscribeWidgetRoot = connect(mapStateToProps, actions)(_SubscribeWidgetRoot);
