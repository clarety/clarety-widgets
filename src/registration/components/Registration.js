import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider as ReduxProvider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { BreakpointProvider } from 'react-socks';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ClaretyApi } from 'clarety-utils';
import { t } from 'shared/translations';
import { statuses, setPanels, setClientIds, setAuth, setTrackingData, fetchSettings, updateAppSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { mapDonationSettings } from 'donate/utils';
import { MiniCart, MiniCartBrand, BusyOverlay, LanguageSelect } from 'registration/components';
import { fetchEvents, fetchAuthCustomer } from 'registration/actions';
import { rootReducer } from 'registration/reducers';
import { RegistrationApi } from 'registration/utils';

export class Registration extends React.Component {
  static store;
  static resources;
  static languages;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    Registration.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resourcs.
    Registration.resources = new Resources();
    Registration.resources.setComponent('MiniCartBrand', MiniCartBrand);
  }

  static setClientIds({ dev, prod }) {
    Registration.store.dispatch(setClientIds({ dev, prod }));
  }

  static setPanels(panels) {
    Registration.resources.setPanels(panels);
    Registration.store.dispatch(setPanels(panels));
  }

  static setLanguages(languages) {
    Registration.languages = languages;
  }

  static setComponent(name, component) {
    Registration.resources.setComponent(name, component);
  }

  render() {
    return (
      <ReduxProvider store={Registration.store}>
        <BreakpointProvider>
          <RegistrationRoot
            resources={Registration.resources}
            languages={Registration.languages}
            {...this.props}
          />
        </BreakpointProvider>
      </ReduxProvider>
    );
  }
}

class _RegistrationRoot extends React.Component {
  async componentDidMount() {
    const { updateAppSettings, fetchEvents, setTrackingData, fetchSettings } = this.props;

    // Init translations.
    i18next.init({
      lng: this.props.defaultLanguage || 'en',
      resources: this.props.languages,
      returnNull: false,
    });
    i18next.on('languageChanged', lng => this.forceUpdate());

    // Settings.
    const { currencySymbol, currencyCode } = this.props;
    const currency = currencySymbol ? { code: currencyCode, symbol: currencySymbol } : undefined;

    updateAppSettings({
      storeId: this.props.storeId,
      seriesId: this.props.seriesId,
      prevSeriesId: this.props.prevSeriesId,
      variant: this.props.variant,
      currency: currency,
      ...this.props.settings,
    });

    // Init API.
    RegistrationApi.init({
      storeId: this.props.storeId,
      seriesId: this.props.seriesId,
      isExpress: this.props.variant === 'express',
    });

    // Auth.
    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      const { setAuth, fetchAuthCustomer } = this.props;
      ClaretyApi.setAuth(jwtAccount.jwtString);
      setAuth(jwtAccount.jwtString);
      await fetchAuthCustomer();
    }

    // Events.
    const didFetch = await fetchEvents();
    if (!didFetch) return;

    // Tracking.
    const { sourceId, sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceId, sourceUid, responseId, emailResponseId });

    // Donations.
    const { storeCode, donationSingleOfferId, donationRecurringOfferId } = this.props;
    if (donationSingleOfferId || donationRecurringOfferId) {
      await fetchSettings('donations/', {
        store: storeCode,
        offerSingle: donationSingleOfferId,
        offerRecurring: donationRecurringOfferId,
      }, mapDonationSettings);
    }
  }

  changeLanguage = (languageCode) => {
    i18next.changeLanguage(languageCode);
  };

  render() {
    const { isBlocking, resources } = this.props;

    return (
      <BlockUi blocking={isBlocking} loader={this.getBusyOverlay()} key={i18next.language}>
        <MiniCart resources={resources} />

        <PanelManager
          layout="stack"
          resources={resources}
        />

        {this.props.showLanguageSelect &&
          <LanguageSelect
            languages={this.props.languages}
            onChange={this.changeLanguage}
          />
        }
      </BlockUi>
    );
  }

  getBusyOverlay() {
    const { isInitializing, isValidating, isSubmitting } = this.props;

    if (isInitializing) return (
      <BusyOverlay message={t('busy.init', 'Just A Moment')} />
    );

    if (isValidating) return (
      <BusyOverlay message={t('busy.validate', 'Checking Your Registration Details')} />
    );

    if (isSubmitting) return (
      <BusyOverlay message={t('busy.submit', 'Submitting Your Registration')} />
    );

    return <span />;
  }
}

const mapStateToProps = state => {
  return {
    isBlocking:     state.status !== statuses.ready,
    isInitializing: state.status === statuses.initializing,
    isValidating:   state.status === statuses.validating,
    isSubmitting:   state.status === statuses.submitting,
  };
};

const actions = {
  updateAppSettings: updateAppSettings,

  setAuth: setAuth,
  fetchAuthCustomer: fetchAuthCustomer,

  fetchEvents: fetchEvents,
  fetchSettings: fetchSettings,
  setTrackingData: setTrackingData,
};

const RegistrationRoot = connect(mapStateToProps, actions)(_RegistrationRoot);
