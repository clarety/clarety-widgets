import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { ClaretyApi } from 'clarety-utils';
import { setStatus, setAuth, setPanels, setClientIds, updateAppSettings, initTrackingData } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { Recaptcha, ErrorMessages } from 'form/components';
import { fetchCustomer } from 'checkout/actions';
import { rootReducer } from 'fundraising-start/reducers';

export class FundraisingStart extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    FundraisingStart.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    FundraisingStart.resources = new Resources();
  }

  static setClientIds({ dev, prod }) {
    FundraisingStart.store.dispatch(setClientIds({ dev, prod }));
  }

  static setPanels(panels) {
    FundraisingStart.resources.setPanels(panels);
    FundraisingStart.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    FundraisingStart.resources.setComponent(name, component);
  }

  render() {
    return (
      <Provider store={FundraisingStart.store}>
        <FundraisingStartRoot
          resources={FundraisingStart.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _FundraisingStartRoot extends React.Component {
  state = { isInitialising: true };

  async componentDidMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    // Translations.
    if (i18next.isInitialized) {
      i18next.on('languageChanged', (language) => {
        this.forceUpdate();
      });
    } else {
      // Use i18next without translation.
      await i18next.init();
    }

    const { updateAppSettings, initTrackingData, setStatus, setAuth, fetchCustomer } = this.props;

    const { currencyCode, currencySymbol } = this.props;
    const currency = currencySymbol ? { code: currencyCode, symbol: currencySymbol } : undefined;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      seriesId: this.props.seriesId,
      storeUid: this.props.storeUid,
      teamId: this.props.teamId,
      teamName: this.props.teamName,
      pageType: this.props.pageType,
      confirmPageUrl: this.props.confirmPageUrl,
      variant: this.props.variant,
      currency: currency,
    });

    initTrackingData(this.props);

    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      ClaretyApi.setAuth(jwtAccount.jwtString);
      setAuth(jwtAccount.jwtString);
      await fetchCustomer(jwtAccount.customer_uid);
    }

    setStatus('ready');
    this.setState({ isInitialising: false });
  }

  render() {
    // Show a loading indicator while we init.
    if (this.state.isInitialising) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-fundraising-start h-100">
        <ErrorMessages />
        <PanelManager layout="accordian" resources={this.props.resources} />
        <Recaptcha siteKey={this.props.reCaptchaKey} language={i18next.language} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const actions = {
  updateAppSettings: updateAppSettings,
  initTrackingData: initTrackingData,
  setStatus: setStatus,
  setAuth: setAuth,
  fetchCustomer: fetchCustomer,
};

const FundraisingStartRoot = connect(mapStateToProps, actions)(_FundraisingStartRoot);
