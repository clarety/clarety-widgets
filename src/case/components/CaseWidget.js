import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider as ReduxProvider } from 'react-redux';
import i18next from 'i18next';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setStore, setStatus, setAuth, initTrackingData, fetchSettings, updateAppSettings, setPanels } from 'shared/actions';
import { PanelManager, StepIndicator } from 'shared/components';
import { Resources, getJwtAccount, getJwtSession } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { rootReducer } from 'case/reducers';
import { setupFormPanels, prefillCustomer, prefillInProgressCase } from 'case/actions';
import { mapCaseSettings, findAndAttemptCaseActionAuth } from 'case/utils';

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
          sectionNavStyle={this.props.sectionNavStyle || 'step-indicator'}
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
    } else {
      // Use i18next without translation.
      await i18next.init();
    }

    this.props.updateAppSettings({
      widgetElementId:      this.props.elementId,
      caseSubject:          this.props.caseSubject,
      allowSave:            this.props.allowSave,
      saveStage:            this.props.saveStage,
      submitStage:          this.props.submitStage,
      eventUid:             this.props.eventUid,
      variant:              this.props.variant,
      shownFields:          this.props.shownFields,
      requiredFields:       this.props.requiredFields,
      fieldTypes:           this.props.fieldTypes,
      saveConfirmPageUrl:   this.props.saveConfirmPageUrl,
      confirmPageUrl:       this.props.confirmPageUrl,
      confirmPageMode:      this.props.confirmPageMode,
      sectionNavStyle:      this.props.sectionNavStyle,
      defaultCountry:       this.props.defaultCountry,
      addressFinderKey:     this.props.addressFinderKey,
      addressFinderCountry: this.props.addressFinderCountry,
    });

    this.props.setStore(this.props.storeUid);

    this.props.initTrackingData(this.props);

    const urlParams = new URLSearchParams(window.location.search);
    let caseUid = urlParams.get('caseUid');

    // Attempt to find and apply auth.
    let hasAuth = false;
    {
      // First try JWT account cookie.
      hasAuth = await this.findAndApplyJwtAccount();

      // Then try action auth URL param.
      if (!hasAuth) {
        const actionAuth = await findAndAttemptCaseActionAuth();
        if (actionAuth) {
          hasAuth = true;
          if (actionAuth.caseUid) caseUid = actionAuth.caseUid;
        }
      }

      // Then try JWT session cookie.
      if (!hasAuth) {
        hasAuth = await this.findAndApplyJwtSession();
      }
    }

    if (hasAuth) {
      const { prefillCustomer, prefillInProgressCase, caseTypeUid, saveStage } = this.props;
      const promises = [];

      // Pre-fill customer data.
      // Note that our JWT might not auth us to load any customer data.
      promises.push(prefillCustomer());

      // Pre-fill in-progress case.
      if (caseUid) {
        if (caseUid !== 'new') {
          promises.push(prefillInProgressCase({ caseUid }));
        }
      } else if (this.props.allowSave) {
        promises.push(prefillInProgressCase({ caseTypeUid, stage: saveStage }));
      }

      await Promise.allSettled(promises);
    }

    await this.props.fetchSettings('cases/', {
      storeUid: this.props.storeUid,
      caseTypeUid: this.props.caseTypeUid,
    }, mapCaseSettings);

    this.props.setupFormPanels();
  }

  async findAndApplyJwtAccount() {
    // Check for jwtAccount cookie.
    const jwtAccount = getJwtAccount();
    if (jwtAccount && jwtAccount.jwtString) {
      ClaretyApi.setAuth(jwtAccount.jwtString);
      this.props.setAuth(jwtAccount.jwtString);
      return true;
    }

    return false;
  }

  async findAndApplyJwtSession() {
    // Check for jwtSession cookie.
    const jwtSession = getJwtSession();
    if (jwtSession && jwtSession.jwtString) {
      ClaretyApi.setJwtSession(jwtSession.jwtString);
      return true;
    }

    return false;
  }

  render() {
    const { status, reCaptchaKey, layout, sectionNavStyle } = this.props;
    const variant = this.props.variant || '';

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    const isBlocked = status === statuses.busy || status === 'busy-save';

    const withNavClassName
      = sectionNavStyle === 'sidebar' ? 'with-section-sidebar'
      : sectionNavStyle === 'step-indicator' ? 'with-step-indicator'
      : '';

    return (
      <div className={`clarety-case-widget h-100 ${layout} ${variant || ''} ${withNavClassName}`}>
        <BlockUi tag="div" blocking={isBlocked} loader={<span></span>}>
          {sectionNavStyle === 'step-indicator' &&
            <StepIndicator />
          }

          <PanelManager
            layout={layout || 'tabs'}
            resources={this.props.resources}
            isPreview={this.props.preview}
          />
        </BlockUi>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} language={i18next.language} />}
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
  setAuth: setAuth,
  initTrackingData: initTrackingData,
  fetchSettings: fetchSettings,
  prefillCustomer: prefillCustomer,
  prefillInProgressCase: prefillInProgressCase,
  updateAppSettings: updateAppSettings,
  setupFormPanels: setupFormPanels,
};

export const connectCaseWidgetRoot = connect(mapStateToProps, actions);
export const CaseWidgetRoot = connectCaseWidgetRoot(_CaseWidgetRoot);
