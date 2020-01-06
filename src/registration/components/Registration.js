import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider as ReduxProvider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { IntlProvider } from 'react-intl';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setPanels, setClientIds, setAuth, setTrackingData, fetchSettings, updateAppSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { mapDonationSettings } from 'donate/utils';
import { NavBarBrand } from 'registration/components/misc/NavBarBrand';
import { MiniCart, BusyOverlay } from 'registration/components';
import { fetchEvents, fetchAuthCustomer } from 'registration/actions';
import { rootReducer } from 'registration/reducers';

// Polyfil plural rules.
if (!Intl.PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/dist/locale-data/en');
}

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

Resources.setComponent('NavBarBrand', NavBarBrand);

class _RegistrationRoot extends React.Component {
  async componentDidMount() {
    const { updateAppSettings, fetchEvents, setTrackingData, fetchSettings } = this.props;

    // Settings.
    updateAppSettings({
      storeId: this.props.storeId,
      seriesId: this.props.seriesId,
      prevSeriesId: this.props.prevSeriesId,
      variant: this.props.variant,
      ...this.props.settings,
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

  render() {
    const { isBlocking } = this.props;

    return (
      <BlockUi blocking={isBlocking} loader={this.getLoader()}>
        <MiniCart />
        <PanelManager layout="stack" />
      </BlockUi>
    );
  }

  getLoader() {
    const { isInitializing, isValidating, isSubmitting } = this.props;

    if (isInitializing) return <BusyOverlay messageId="busy.init" />;
    if (isValidating)   return <BusyOverlay messageId="busy.validate" />;
    if (isSubmitting)   return <BusyOverlay messageId="busy.submit" />;

    return <span />;
  }
}

const mapStateToProps = state => {
  return {
    isBlocking: state.status !== statuses.ready,
    isInitializing: state.status === statuses.initializing,
    isValidating: state.status === statuses.validating,
    isSubmitting: state.status === statuses.submitting,
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

export class Registration extends React.Component {
  static setPanels(panels) {
    Resources.setPanels(panels);
    store.dispatch(setPanels(panels));
  }

  static setClientIds({ dev, prod }) {
    store.dispatch(setClientIds({ dev, prod }));
  }

  render() {
    return (
      <IntlProvider locale="en" messages={this.props.translations}>
        <ReduxProvider store={store}>
          <RegistrationRoot {...this.props} />
        </ReduxProvider>
      </IntlProvider>
    );
  }
}
