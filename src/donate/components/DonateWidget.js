import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider as ReduxProvider } from 'react-redux';
import i18next from 'i18next';
import { BreakpointProvider } from 'react-socks';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses, setStore, initTrackingData, fetchSettings, updateAppSettings, setPanels, setApiCampaignUids } from 'shared/actions';
import { PanelManager, StepIndicator } from 'shared/components';
import { getJwtCustomer, getJwtAccount, Resources, convertOptions, setApiFacebookCookies } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { handleAmountUrlParam, selectFrequency } from 'donate/actions';
import { rootReducer } from 'donate/reducers';
import { DonationApi, mapDonationSettings, setupDefaultResources } from 'donate/utils';
import { fetchCustomer } from 'donate/actions/customer-actions';
import { fetchIncompleteSale } from 'donate/actions/sale-actions';

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
    const { updateAppSettings, setStore, initTrackingData, fetchSettings, handleAmountUrlParam, setApiCampaignUids } = this.props;

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

    updateAppSettings({
      singleOfferId:        singleOfferId,
      recurringOfferId:     recurringOfferId,
      categoryUid:          categoryUid,
      variant:              this.props.variant,
      confirmPageUrl:       this.props.confirmPageUrl,
      confirmPageMode:      this.props.confirmPageMode,
      defaultCountry:       this.props.defaultCountry,
      fundraisingPageUid:   this.props.fundraisingPageUid,
      givingTypeOptions:    convertOptions(this.props.givingTypeOptions),
      addressFinderKey:     this.props.addressFinderKey,
      addressFinderCountry: this.props.addressFinderCountry,
      hideCurrencyCode:     this.props.hideCurrencyCode,
      defaultFrequency:     this.props.defaultFrequency,
      mainSiteUrl:          this.props.mainSiteUrl,
      createSaleOnCustomerPanel: this.props.createSaleOnCustomerPanel,
      expressPaymentBtnHeight: this.props.expressPaymentBtnHeight,
      requiredLabelType:    this.props.requiredLabelType,
      layout:               this.props.layout || 'tabs',
      reCaptchaKey:         this.props.reCaptchaKey,
    });

    setStore(storeUid);

    initTrackingData(this.props);
    setApiCampaignUids();
    setApiFacebookCookies();

    const promises = [];

    const authResult = await this.attemptAuth();
    if (authResult.hasCustomerAuth) {
      promises.push(this.props.fetchCustomer());
    }

    promises.push(
      fetchSettings( 'donations/', {
        storeUid: storeUid,
        offerSingle: singleOfferId,
        offerRecurring: recurringOfferId,
        categoryUid: categoryUid,
      }, mapDonationSettings)
    );

    await Promise.all(promises);

    // Select default frequency.
    const { defaultFrequency, selectFrequency } = this.props;
    if (defaultFrequency) selectFrequency(defaultFrequency);

    handleAmountUrlParam();

    // load the incomplete sale _last_
    if (authResult.hasSaleAuth) {
      await this.props.fetchIncompleteSale();
    }
  }

  async attemptAuth() {
    const authResult = {
      hasCustomerAuth: false,
      hasSaleAuth: false,
    };

    // Check for jwt account cookie.
    const jwtAccount = getJwtAccount();
    if (jwtAccount && jwtAccount.jwtString) {
      DonationApi.setAuth(jwtAccount.jwtString);
      authResult.hasCustomerAuth = true;
      return authResult;
    }

    // Check for jwt customer cookie.
    const cookieJwt = getJwtCustomer();
    if (cookieJwt && cookieJwt.jwtString) {
      DonationApi.setJwtCustomer(cookieJwt.jwtString);
      authResult.hasCustomerAuth = true;
      return authResult;
    }

    // Check for action auth.
    const actionKey = new URLSearchParams(window.location.search).get('clarety_action');
    if (actionKey) {
      const actionAuth = await DonationApi.actionAuth(actionKey);
      if (actionAuth) {
        if (actionAuth.jwtCustomer) {
          DonationApi.setJwtCustomer(actionAuth.jwtCustomer);
          authResult.hasCustomerAuth = true;
          return authResult;
        }

        // If auth action returns a session we will attempt to load an incomplete sale.
        if (actionAuth.jwtSession) {
          DonationApi.setJwtSession(actionAuth.jwtSession);
          authResult.hasCustomerAuth = true;
          authResult.hasSaleAuth = true;
          return authResult;
        }
      }
    }

    return authResult;
  }

  render() {
    const { status, reCaptchaKey, showStepIndicator } = this.props;
    const layout = this.props.layout || 'tabs';
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
            layout={layout}
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
    status: state.status,
    offers: state.settings.priceHandles,
  };
};

const actions = {
  setStore: setStore,
  initTrackingData: initTrackingData,
  fetchSettings: fetchSettings,
  updateAppSettings: updateAppSettings,
  handleAmountUrlParam: handleAmountUrlParam,
  setApiCampaignUids: setApiCampaignUids,
  fetchCustomer: fetchCustomer,
  fetchIncompleteSale: fetchIncompleteSale,
  selectFrequency: selectFrequency,
};

export const connectDonateWidgetRoot = connect(mapStateToProps, actions);
export const DonateWidgetRoot = connectDonateWidgetRoot(_DonateWidgetRoot);
