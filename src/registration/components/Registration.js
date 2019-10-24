import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider as ReduxProvider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { IntlProvider } from 'react-intl';
import 'intl-pluralrules'; // Polyfill for safari 12
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setPanels, setClientIds, setAuth, setTrackingData, fetchSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { Brand } from 'registration/components/misc/Brand';
import { MiniCart, BusyOverlay } from 'registration/components';
import { fetchEvents, fetchAuthCustomer } from 'registration/actions';
import { rootReducer } from 'registration/reducers';
import { mapDonationSettings } from 'registration/utils';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

Resources.setComponent('Brand', Brand);

class _RegistrationRoot extends React.Component {
  async componentDidMount() {
    const { fetchEvents, setTrackingData, fetchSettings } = this.props;

    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      const { setAuth, fetchAuthCustomer } = this.props;
      ClaretyApi.setAuth(jwtAccount.jwtString);
      setAuth(jwtAccount.jwtString);
      await fetchAuthCustomer();
    }

    const didFetch = await fetchEvents();
    if (!didFetch) return;

    const { sourceId, sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceId, sourceUid, responseId, emailResponseId });

    await fetchSettings('donations/', {
      store: this.props.storeCode,
      offerSingle: this.props.singleOfferId,
      offerRecurring: this.props.recurringOfferId,
    }, mapDonationSettings);
  }

  render() {
    return (
      <BlockUi blocking={this.props.isBlocking} loader={this.getLoader()}>
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
