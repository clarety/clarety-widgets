import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider as ReduxProvider } from 'react-redux';
import i18next from 'i18next';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses, setStore, setStatus, initTrackingData, fetchSettings, updateAppSettings, setPanels, changeLanguage } from 'shared/actions';
import { PanelManager, StepIndicator } from 'shared/components';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { rootReducer } from 'case/reducers';
import { setupFormPanels } from 'case/actions';
import { mapCaseSettings } from 'case/utils';

export class CaseWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup redux store.
    const middleware = applyMiddleware(thunk);
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    CaseWidget.store = createStore(rootReducer, composeDevTools(middleware));

    // Setup resources.
    CaseWidget.resources = new Resources();
  }

  static appSettings(settings) {
    CaseWidget.store.dispatch(updateAppSettings(settings));
  }

  static setPanels(panels) {
    CaseWidget.resources.setPanels(panels);
    CaseWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    CaseWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <ReduxProvider store={CaseWidget.store}>
        <CaseWidgetRoot
          resources={CaseWidget.resources}
          {...this.props}
        />
      </ReduxProvider>
    );
  }
}

export class _CaseWidgetRoot extends React.Component {
  async componentWillMount() {
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

    this.props.updateAppSettings({
      widgetElementId:      this.props.elementId,
      caseStage:            this.props.caseStage,
      variant:              this.props.variant,
      shownFields:          this.props.shownFields,
      requiredFields:       this.props.requiredFields,
      confirmPageUrl:       this.props.confirmPageUrl,
      defaultCountry:       this.props.defaultCountry,
      addressFinderKey:     this.props.addressFinderKey,
      addressFinderCountry: this.props.addressFinderCountry,
    });

    this.props.setStore(this.props.storeUid);

    this.props.initTrackingData(this.props);

    await this.props.fetchSettings('cases/', {
      storeUid: this.props.storeUid,
      caseTypeUid: this.props.caseTypeUid,
    }, mapCaseSettings);

    this.props.setupFormPanels();
  }

  render() {
    const { status, reCaptchaKey, layout, showStepIndicator } = this.props;
    const variant = this.props.variant || '';

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className={`clarety-case-widget h-100 ${layout} ${variant}`}>
        <BlockUi tag="div" blocking={status === statuses.busy} loader={<span></span>}>
          {showStepIndicator && <StepIndicator />}

          <PanelManager
            layout={layout || 'tabs'}
            resources={this.props.resources}
          />
        </BlockUi>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status
  };
};

const actions = {
  setStore: setStore,
  setStatus: setStatus,
  initTrackingData: initTrackingData,
  fetchSettings: fetchSettings,
  updateAppSettings: updateAppSettings,
  changeLanguage: changeLanguage,
  setupFormPanels: setupFormPanels,
};

export const connectCaseWidgetRoot = connect(mapStateToProps, actions);
export const CaseWidgetRoot = connectCaseWidgetRoot(_CaseWidgetRoot);
