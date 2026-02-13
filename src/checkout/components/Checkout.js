import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { t } from 'shared/translations';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { Resources, getJwtSession, getJwtAccount } from 'shared/utils';
import { PanelManager } from 'shared/components';
import { setPanels, setClientIds, setAuth, fetchSettings, updateAppSettings, removePanels } from 'shared/actions';
import { getIsCartComplete, getCartShippingRequired } from 'shared/selectors';
import { updateFormData } from 'form/actions';
import { Recaptcha } from 'form/components';
import { fetchCart, fetchCustomer } from 'checkout/actions';
import { shouldAllowExpressCheckout } from 'checkout/selectors';
import { rootReducer } from 'checkout/reducers';
import { CartSummary, ExpressCheckout } from 'checkout/components';
import { setupDefaultResources } from 'checkout/utils';

export class Checkout extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    Checkout.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    Checkout.resources = new Resources();
    setupDefaultResources(Checkout.resources);
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

  render() {
    return (
      <Provider store={Checkout.store}>
        <CheckoutRoot
          store={Checkout.store}
          resources={Checkout.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _CheckoutRoot extends React.Component {
  state = {
    isReady: false,
    isCartComplete: false,
  };

  async componentDidMount() {
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
      storeUid:             this.props.storeUid,
      defaultCountry:       this.props.defaultCountry,
      addressFinderKey:     this.props.addressFinderKey,
      addressFinderCountry: this.props.addressFinderCountry,
      loqateKey:            this.props.loqateKey,
      loqateCountry:        this.props.loqateCountry,
      donationOfferId:      this.props.donationOfferId,
      donationOfferUid:     this.props.donationOfferUid,
    });

    // Set tracking data.
    const { updateFormData } = this.props;
    updateFormData('sale.sourceId', this.props.sourceId);
    updateFormData('sale.sendResponseUid', this.props.responseId);
    updateFormData('sale.emailResponseUid', this.props.emailResponseId);
    updateFormData('sale.channel', this.props.channel);

    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      ClaretyApi.setAuth(jwtAccount.jwtString);
      this.props.setAuth(jwtAccount.jwtString);
      await this.props.fetchCustomer(jwtAccount.customer_uid);
    }

    const jwtSession = getJwtSession();
    if (jwtSession) {
      ClaretyApi.setJwtSession(jwtSession.jwtString);
      await this.props.fetchCart(jwtSession.cartUid);

      const state = this.props.store.getState();
      this.setState({ isCartComplete: getIsCartComplete(state) });

      // Remove shipping panel if shipping isn't required.
      if (!getCartShippingRequired(state)) {
        this.props.removePanels({ withComponent: 'ShippingPanel' });
      }
    }

    await this.props.fetchSettings('checkout/', { cartUid: jwtSession.cartUid });

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

    const { reCaptchaKey, showExpressCheckout } = this.props;

    return (
      <Provider store={this.props.store}>
        <Container fluid>
          <Row>
            <Col lg={6} className="col-summary order-lg-1">
              <CartSummary resources={this.props.resources} allowEdit />
            </Col>

            <Col lg={6} className="col-checkout">
              <h1>{t('checkout', 'Checkout')}</h1>

              {showExpressCheckout &&
                <ExpressCheckout />
              }

              <PanelManager layout="accordian" resources={this.props.resources} />
            </Col>
          </Row>
        </Container>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} language={i18next.language} />}
      </Provider>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    showExpressCheckout: shouldAllowExpressCheckout(state),
  };
};

const actions = {
  updateAppSettings: updateAppSettings,
  updateFormData: updateFormData,
  setAuth: setAuth,
  fetchCart: fetchCart,
  fetchSettings: fetchSettings,
  fetchCustomer: fetchCustomer,
  removePanels: removePanels,
};

export const connectCheckoutRoot = connect(mapStateToProps, actions);
export const CheckoutRoot = connectCheckoutRoot(_CheckoutRoot);
