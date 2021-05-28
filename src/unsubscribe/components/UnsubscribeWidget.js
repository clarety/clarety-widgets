import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { statuses, setPanels, updateAppSettings, initTrackingData, changeLanguage, setStatus } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { rootReducer } from 'unsubscribe/reducers';

export class UnsubscribeWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    UnsubscribeWidget.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    UnsubscribeWidget.resources = new Resources();
  }

  static setPanels(panels) {
    UnsubscribeWidget.resources.setPanels(panels);
    UnsubscribeWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    UnsubscribeWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <Provider store={UnsubscribeWidget.store}>
        <UnsubscribeRoot
          resources={UnsubscribeWidget.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _UnsubscribeRoot extends React.Component {
  async componentWillMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    // Translations.
    if (i18next.isInitialized) {
      i18next.on('languageChanged', (language) => {
        this.forceUpdate();
      });
  
      this.props.changeLanguage(i18next.language);
    } else {
      // Use i18next without translation.
      await i18next.init();
    }

    const { updateAppSettings, initTrackingData } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      variant: this.props.variant,
      confirmPageUrl: this.props.confirmPageUrl,
    });

    initTrackingData(this.props);

    this.props.setStatus('ready');
  }

  render() {
    const { status, variant, resources, reCaptchaKey } = this.props;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className={`clarety-unsubscribe-widget h-100 ${variant}`}>
        <PanelManager layout="tabs" resources={resources} />
        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
  };
};

const actions = {
  updateAppSettings: updateAppSettings,
  initTrackingData: initTrackingData,
  changeLanguage: changeLanguage,
  setStatus: setStatus,
};

const UnsubscribeRoot = connect(mapStateToProps, actions)(_UnsubscribeRoot);
