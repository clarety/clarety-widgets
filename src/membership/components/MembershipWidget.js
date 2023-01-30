import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider as ReduxProvider } from 'react-redux';
import i18next from 'i18next';
import { BreakpointProvider } from 'react-socks';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses, setStore, initTrackingData, fetchSettings, updateAppSettings, setPanels, setPanelSettings, setApiCampaignUids } from 'shared/actions';
import { PanelManager, StepIndicator } from 'shared/components';
import { getJwtCustomer, Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { fetchCustomer } from 'donate/actions/customer-actions';
import { ensureValidDonationPanel, fetchOffersIfChanged } from 'membership/actions';
import { rootReducer } from 'membership/reducers';
import { MembershipApi, mapMembershipWidgetSettings, setupDefaultResources } from 'membership/utils';

export class MembershipWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup redux store.
    const middleware = applyMiddleware(thunk);
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    MembershipWidget.store = createStore(rootReducer, composeDevTools(middleware));

    // Setup resources.
    MembershipWidget.resources = new Resources();
    setupDefaultResources(MembershipWidget.resources);
  }

  static appSettings(settings) {
    MembershipWidget.store.dispatch(updateAppSettings(settings));
  }

  static setPanels(panels) {
    MembershipWidget.resources.setPanels(panels);
    MembershipWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    MembershipWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <ReduxProvider store={MembershipWidget.store}>
        <BreakpointProvider>
          <MembershipWidgetRoot
            resources={MembershipWidget.resources}
            {...this.props}
          />
        </BreakpointProvider>
      </ReduxProvider>
    );
  }
}

export class _MembershipWidgetRoot extends React.Component {
  async componentDidMount() {
    const { storeUid, singleOfferId, categoryUid } = this.props;
    const { updateAppSettings, setPanelSettings, setStore, initTrackingData, fetchSettings, setApiCampaignUids, fetchCustomer, fetchOffersIfChanged } = this.props;

    if (!this.props.preview && !singleOfferId && !categoryUid) {
      throw new Error('[MembershipWidget] A singleOfferId or categoryUid is required');
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
      categoryUid:          categoryUid,
      variant:              this.props.variant,
      confirmPageUrl:       this.props.confirmPageUrl,
      confirmPageMode:      this.props.confirmPageMode,
      defaultCountry:       this.props.defaultCountry,
      addressFinderKey:     this.props.addressFinderKey,
      addressFinderCountry: this.props.addressFinderCountry,
      hideCurrencyCode:     this.props.hideCurrencyCode,
      defaultFrequency:     this.props.defaultFrequency,
    });

    if (this.props.preview && parent) {
      window.addEventListener('message', async (event) => {
        if (event.data.action === 'update-settings') {
          const updatedSettings = event.data.settings;

          console.log('[WIDGET]', 'update-settings', updatedSettings);

          // App settings.
          if (updatedSettings.app) {
            // Use null for any unset offers.
            if (!updatedSettings.app.singleOfferId) updatedSettings.app.singleOfferId = null;
            if (!updatedSettings.app.categoryUid) updatedSettings.app.categoryUid = null;

            // Re-fetch price handles if offers changed.
            fetchOffersIfChanged({
              singleOfferId: updatedSettings.app.singleOfferId,
              categoryUid:   updatedSettings.app.categoryUid,
            }).then(() => {
              this.props.ensureValidDonationPanel();
            });

            updateAppSettings(updatedSettings.app);
          }

          // Panel settings.
          if (updatedSettings.panels) {
            for (const [panelName, panelSettings] of Object.entries(updatedSettings.panels)) {
              setPanelSettings(panelName, panelSettings);
            }
          }          
        }
      });

      parent.postMessage({ action: 'widget-ready' }, '*');
    }

    setStore(storeUid);

    initTrackingData(this.props);
    setApiCampaignUids();

    const jwtCustomer = await this.findJwtCustomer();
    if (jwtCustomer) {
      MembershipApi.setJwtCustomer(jwtCustomer);
      await fetchCustomer();
    }

    await fetchSettings('membership/', {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      categoryUid: categoryUid,
    }, mapMembershipWidgetSettings);

    this.props.ensureValidDonationPanel();
  }

  async findJwtCustomer() {
    // Check for cookie.
    const cookieJwt = getJwtCustomer();
    if (cookieJwt && cookieJwt.jwtString) return cookieJwt.jwtString;

    // Check for action auth.
    const actionKey = new URLSearchParams(window.location.search).get('clarety_action');
    if (actionKey) {
      const actionAuth = await MembershipApi.actionAuth(actionKey);
      if (actionAuth && actionAuth.jwtCustomer) return actionAuth.jwtCustomer;
    }

    return null;
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

    // Check if we're previewing in the widget designer and don't have an offer yet.
    if (this.props.preview && (!this.props.offers || !this.props.offers.length)) {
      return (
        <div className="text-center">Select an offer to get started</div>
      );
    }

    return (
      <div className={`clarety-membership-widget h-100 ${layout} ${variant}`}>
        <BlockUi tag="div" blocking={status === statuses.busy} loader={<span></span>}>
          {showStepIndicator && <StepIndicator />}

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
    status: state.status,
    offers: state.settings.membershipOffers,
  };
};

const actions = {
  setStore: setStore,
  initTrackingData: initTrackingData,
  fetchSettings: fetchSettings,
  updateAppSettings: updateAppSettings,
  setPanelSettings: setPanelSettings,
  setApiCampaignUids: setApiCampaignUids,
  fetchCustomer: fetchCustomer,
  fetchOffersIfChanged: fetchOffersIfChanged,
  ensureValidDonationPanel: ensureValidDonationPanel,
};

export const connectMembershipWidgetRoot = connect(mapStateToProps, actions);
export const MembershipWidgetRoot = connectMembershipWidgetRoot(_MembershipWidgetRoot);
