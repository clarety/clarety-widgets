import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { ClaretyApi } from 'clarety-utils';
import { t } from 'shared/translations';
import { Resources, getJwtSession, getJwtAccount } from 'shared/utils';
import { PanelManager } from 'shared/components';
import { setPanels, setClientIds, setAuth, fetchSettings, updateAppSettings, removePanels, changeLanguage } from 'shared/actions';
import { getIsCartComplete, getCartShippingRequired } from 'shared/selectors';
import { updateFormData } from 'form/actions';
import { Recaptcha } from 'form/components';
import { fetchCart, fetchCustomer } from 'checkout/actions';
import { rootReducer } from 'checkout/reducers';
import { CartSummary } from 'checkout/components';
import { setupDefaultResources } from 'checkout/utils';

export class Checkout extends React.Component {
  static store;
  static resources;
  static translationsPath;

  state = { isReady: false, isCartComplete: false };

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    Checkout.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    Checkout.resources = new Resources();
    setupDefaultResources(Checkout.resources);
  }

  static setTranslationsPath(path) {
    Checkout.translationsPath = path;
  }

  static setClientIds({ dev, prod }) {
    Checkout.store.dispatch(setClientIds({ dev, prod }));
  }

  static setPanels(panels) {
    Checkout.resources.setPanels(panels);
    Checkout.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    Checkout.resources.setComponent(name, component);
  }

  async componentDidMount() {
    // Translations.
    const { defaultLanguage } = this.props;
    const language = defaultLanguage || navigator.language || navigator.userLanguage || 'en';
    i18next.use(i18nextHttpBackend);
    await i18next.init({
      load: 'languageOnly',
      lng: language,
      fallbackLng: defaultLanguage || 'en',
      returnNull: false,
      keySeparator: false,
      backend: {
        loadPath: Checkout.translationsPath,
      },
    });

    i18next.on('languageChanged', (language) => {
      this.forceUpdate();
    });

    Checkout.store.dispatch(changeLanguage(language));

    Checkout.store.dispatch(updateAppSettings({
      storeUid:             this.props.storeUid,
      defaultCountry:       this.props.defaultCountry,
      addressFinderKey:     this.props.addressFinderKey,
      addressFinderCountry: this.props.addressFinderCountry,
      donationOfferId:      this.props.donationOfferId,
      donationOfferUid:     this.props.donationOfferUid,
    }));

    // Set tracking data.
    Checkout.store.dispatch(updateFormData('sale.sendResponseUid', this.props.responseId));
    Checkout.store.dispatch(updateFormData('sale.emailResponseUid', this.props.emailResponseId));

    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      ClaretyApi.setAuth(jwtAccount.jwtString);
      Checkout.store.dispatch(setAuth(jwtAccount.jwtString));
      await Checkout.store.dispatch(fetchCustomer(jwtAccount.customer_uid));
    }

    const jwtSession = getJwtSession();
    if (jwtSession) {
      ClaretyApi.setJwtSession(jwtSession.jwtString);
      await Checkout.store.dispatch(fetchCart(jwtSession.cartUid));

      const state = Checkout.store.getState();
      this.setState({ isCartComplete: getIsCartComplete(state) });

      // Remove shipping panel if shipping isn't required.
      if (!getCartShippingRequired(state)) {
        Checkout.store.dispatch(removePanels({ withComponent: 'ShippingPanel' }));
      }
    }

    await Checkout.store.dispatch(fetchSettings('checkout/', { cartUid: jwtSession.cartUid }));

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
          <Spinner animation="border" />
        </div>
      );
    }

    if (this.state.isCartComplete) {
      return (
        <div className="text-center">
          {t('checkout-cart-complete', 'Your order has already been completed.')}
        </div>
      );
    }

    const { reCaptchaKey } = this.props;

    return (
      <Provider store={Checkout.store}>
        <Container fluid>
          <Row>
            <Col lg={6} className="col-summary order-lg-1">
              <CartSummary resources={Checkout.resources} />
            </Col>

            <Col lg={6} className="col-checkout">
              <h1>{t('checkout', 'Checkout')}</h1>
              <PanelManager layout="accordian" resources={Checkout.resources} />
            </Col>
          </Row>
        </Container>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
      </Provider>
    );
  }
}
