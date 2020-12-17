import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { statuses, setPanels, setLanguages, updateAppSettings, initTrackingData, changeLanguage, setStatus } from 'shared/actions';
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

  static setLanguages(languages) {
    UnsubscribeWidget.languages = languages;
    UnsubscribeWidget.store.dispatch(setLanguages(languages));
  }

  static setComponent(name, component) {
    UnsubscribeWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <Provider store={UnsubscribeWidget.store}>
        <UnsubscribeRoot
          resources={UnsubscribeWidget.resources}
          languages={UnsubscribeWidget.languages}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _UnsubscribeRoot extends React.Component {
  componentWillMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');
    
    const { updateAppSettings, initTrackingData } = this.props;

    // Translations.
    const { languages, defaultLanguage, changeLanguage } = this.props;
    const language = defaultLanguage || navigator.language || navigator.userLanguage || 'en';
    i18next.init({
      load: 'languageOnly',
      lng: language,
      fallbackLng: defaultLanguage || 'en',
      resources: languages,
      returnNull: false,
    });

    i18next.on('languageChanged', (language) => {
      this.forceUpdate();
    });

    changeLanguage(language);

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
