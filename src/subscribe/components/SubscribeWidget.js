import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { PanelManager } from 'shared/components';
import { setPanels, fetchSettings, updateAppSettings, initTrackingData, setPanelSettings } from 'shared/actions';
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
    // Translations.
    if (i18next.isInitialized) {
      i18next.on('languageChanged', (language) => {
        this.forceUpdate();
      });
    } else {
      // Use i18next without translation.
      await i18next.init();
    }

    const { updateAppSettings, setPanelSettings, initTrackingData } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      caseTypeUid: this.props.caseTypeUid,
      caseStage: this.props.caseStage,
      dropOptInField: this.props.dropOptInField,
      confirmPageUrl: this.props.confirmPageUrl,
      defaultCountry: this.props.defaultCountry,
      reCaptchaKey: this.props.reCaptchaKey,
    });

    setPanelSettings('CustomerPanel', {
      nameOption: this.props.nameOption,
      buttonText: this.props.buttonText,
      showState: this.props.showState,
      showCountry: this.props.showCountry,
    });
    
    initTrackingData(this.props);

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
        {this.renderHeader()}

        <PanelManager
          layout="tabs"
          resources={this.props.resources}
          isPreview={this.props.preview}
        />

        {reCaptchaKey &&
          <Recaptcha
            siteKey={reCaptchaKey}
            language={i18next.language}
          />
        }
      </div>
    );
  }

  renderHeader() {
    const { HeaderComponent } = this.props;

    if (HeaderComponent) {
      return <HeaderComponent {...this.props} />;
    }

    return null;
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
  initTrackingData: initTrackingData,
  fetchSettings: fetchSettings,
};

const SubscribeWidgetRoot = connect(mapStateToProps, actions)(_SubscribeWidgetRoot);
