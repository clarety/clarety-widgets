import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider as ReduxProvider } from 'react-redux';
import i18next from 'i18next';
import { BreakpointProvider } from 'react-socks';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses, setStore, initTrackingData, fetchSettings, updateAppSettings, setPanels } from 'shared/actions';
import { PanelManager, StepIndicator } from 'shared/components';
import { getJwtCustomer, Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { handleUrlParams, selectFrequency } from 'donate/actions';
import { rootReducer } from 'donate/reducers';
import { DonationApi, mapDonationSettings, setupDefaultResources } from 'donate/utils';
import { fetchCustomer } from 'donate/actions/customer-actions';

export class DonateWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup redux store.
    const middleware = applyMiddleware(thunk);
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    DonateWidget.store = createStore(rootReducer, composeDevTools(middleware));

    // Setup resources.
    DonateWidget.resources = new Resources();
    setupDefaultResources(DonateWidget.resources);
  }

  static appSettings(settings) {
    DonateWidget.store.dispatch(updateAppSettings(settings));
  }

  static setPanels(panels) {
    DonateWidget.resources.setPanels(panels);
    DonateWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    DonateWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <ReduxProvider store={DonateWidget.store}>
        <BreakpointProvider>
          <DonateWidgetRoot
            resources={DonateWidget.resources}
            {...this.props}
          />
        </BreakpointProvider>
      </ReduxProvider>
    );
  }
}

export class _DonateWidgetRoot extends React.Component {
  async componentDidMount() {
    const { storeUid, singleOfferId, recurringOfferId, categoryUid } = this.props;
    const { updateAppSettings, setStore, initTrackingData, fetchSettings, handleUrlParams, fetchCustomer } = this.props;

    if (!singleOfferId && !recurringOfferId && !categoryUid) {
      throw new Error('[DonateWidget] A singleOfferId, recurringOfferId, or categoryUid is required');
    }

    // Translations.
    if (i18next.isInitialized) {
      i18next.on('languageChanged', (language) => {
        this.forceUpdate();
      });
    } else {
      // Use i18next without translation.
      await i18next.init();
    }

    const givingTypeOptions = this.props.givingTypeOptions
      ? this.props.givingTypeOptions.map(option => ({ value: option, label: option }))
      : undefined;

    updateAppSettings({
      singleOfferId:        singleOfferId,
      recurringOfferId:     recurringOfferId,
      variant:              this.props.variant,
      confirmPageUrl:       this.props.confirmPageUrl,
      defaultCountry:       this.props.defaultCountry,
      fundraisingPageUid:   this.props.fundraisingPageUid,
      givingTypeOptions:    givingTypeOptions,
      addressFinderKey:     this.props.addressFinderKey,
      addressFinderCountry: this.props.addressFinderCountry,
      hideCurrencyCode:     this.props.hideCurrencyCode,
      defaultFrequency:     this.props.defaultFrequency,
    });

    setStore(storeUid);

    initTrackingData(this.props);

    const jwtCustomer = getJwtCustomer();
    if (jwtCustomer) {
      DonationApi.setJwtCustomer(jwtCustomer.jwtString);
      await fetchCustomer();
    }

    await fetchSettings('donations/', {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
      categoryUid: categoryUid,
    }, mapDonationSettings);

    // Select default frequency.
    const { defaultFrequency, selectFrequency } = this.props;
    if (defaultFrequency) selectFrequency(defaultFrequency);

    handleUrlParams();
  }

  render() {
    const { status, reCaptchaKey, showStepIndicator, layout } = this.props;
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
      <div className={`clarety-donate-widget h-100 ${layout} ${variant}`}>
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
  initTrackingData: initTrackingData,
  fetchSettings: fetchSettings,
  updateAppSettings: updateAppSettings,
  handleUrlParams: handleUrlParams,
  fetchCustomer: fetchCustomer,
  selectFrequency: selectFrequency,
};

export const connectDonateWidgetRoot = connect(mapStateToProps, actions);
export const DonateWidgetRoot = connectDonateWidgetRoot(_DonateWidgetRoot);
