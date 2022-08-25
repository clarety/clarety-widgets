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
import { statuses, setPanels, setClientIds, setAuth, initTrackingData, fetchSettings, updateAppSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg, SuggestedAmountPriceOnly } from 'donate/components';
import { MiniCart, MiniCartBrand, BusyOverlay } from 'registration/components';
import { fetchEvents, fetchFullEvent, fetchAuthCustomer, setFundraising } from 'registration/actions';
import { rootReducer } from 'registration/reducers';
import { RegistrationApi } from 'registration/utils';

export class Registration extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    Registration.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resourcs.
    Registration.resources = new Resources();
    Registration.resources.setComponent('MiniCartBrand', MiniCartBrand);
    Registration.resources.setComponent('SuggestedAmount', SuggestedAmount);
    Registration.resources.setComponent('VariableAmount', VariableAmount);
    Registration.resources.setComponent('SuggestedAmountLg', SuggestedAmountLg);
    Registration.resources.setComponent('VariableAmountLg', VariableAmountLg);
    Registration.resources.setComponent('SuggestedAmountPriceOnly', SuggestedAmountPriceOnly);
    Registration.resources.setComponent('VariableAmountPriceOnly', VariableAmount);
  }

  static setClientIds({ dev, prod }) {
    Registration.store.dispatch(setClientIds({ dev, prod }));
  }

  static setPanels(panels) {
    Registration.resources.setPanels(panels);
    Registration.store.dispatch(setPanels(panels));
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
            {...this.props}
          />
        </BreakpointProvider>
      </ReduxProvider>
    );
  }
}

class _RegistrationRoot extends React.Component {
  async componentDidMount() {
    // Settings.
    const { currencySymbol, currencyCode, updateAppSettings } = this.props;
    const currency = currencySymbol ? { code: currencyCode, symbol: currencySymbol } : undefined;
    updateAppSettings({
      storeId: this.props.storeId,
      seriesId: this.props.seriesId,
      prevSeriesId: this.props.prevSeriesId,
      teamType: this.props.teamType,
      variant: this.props.variant,
      paymentMethods: this.props.paymentMethods,
      languages: this.props.languages,
      currency: currency,
      ...this.props.settings,
    });

    // Translations.
    if (i18next.isInitialized) {
      i18next.on('languageChanged', (language) => {
        this.forceUpdate();
        RegistrationApi.locale = language;
        this.fetchInitData();
      });
    } else {
      // Use i18next without translation.
      await i18next.init();
    }

    // Tracking.
    this.props.initTrackingData(this.props);

    // Fundraising.
    const { fundraisingGoal, fundraisingCreatePage, setFundraising } = this.props;
    setFundraising({
      goal: fundraisingGoal,
      createPage: fundraisingCreatePage,
    });

    // Init API.
    const { storeId, seriesId, defaultLanguage } = this.props;
    RegistrationApi.init({ storeId, seriesId, locale: defaultLanguage });

    // Auth.
    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      const { setAuth, fetchAuthCustomer } = this.props;
      ClaretyApi.setAuth(jwtAccount.jwtString);
      setAuth(jwtAccount.jwtString);
      await fetchAuthCustomer();
    }

    this.fetchInitData();
  }

  fetchInitData() {
    // Events.
    const { eventId, fetchFullEvent, fetchEvents } = this.props;
    if (eventId) {
      fetchFullEvent(eventId);
    } else {
      fetchEvents();
    }

    // Donations.
    const { storeUid, donationSingleOfferId, donationRecurringOfferId, fetchSettings } = this.props;
    if (donationSingleOfferId || donationRecurringOfferId) {
      const mapDonationSettings = (result) => ({ priceHandles: result.offers });

      fetchSettings('donations/', {
        storeUid: storeUid,
        offerSingle: donationSingleOfferId,
        offerRecurring: donationRecurringOfferId,
        locale: RegistrationApi.locale,
      }, mapDonationSettings);
    }
  }

  render() {
    const { isBlocking, resources } = this.props;

    return (
      <BlockUi blocking={isBlocking} loader={this.getBusyOverlay()} key={i18next.language}>
        <MiniCart resources={resources} />

        <PanelManager
          layout="stack"
          resources={resources}
        />
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
  initTrackingData: initTrackingData,
  setFundraising: setFundraising,

  fetchEvents: fetchEvents,
  fetchFullEvent: fetchFullEvent,
  fetchSettings: fetchSettings,
  fetchAuthCustomer: fetchAuthCustomer,
};

const RegistrationRoot = connect(mapStateToProps, actions)(_RegistrationRoot);
