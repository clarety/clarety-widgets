import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { ClaretyApi } from 'clarety-utils';
import { Resources, getJwtSession, getJwtAccount } from 'shared/utils';
import { PanelManager } from 'shared/components';
import { setPanels, setClientIds, setAuth } from 'shared/actions';
import { getIsCartComplete } from 'shared/selectors';
import { fetchCart, fetchCustomer } from 'checkout/actions';
import { rootReducer } from 'checkout/reducers';
import { CartSummary } from 'checkout/components';

export class Checkout extends React.Component {
  static store;
  static resources;

  state = { isReady: false, isCartComplete: false };

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    Checkout.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    Checkout.resources = new Resources();
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
    }

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px' }}>
          <Spinner animation="border" />
        </div>
      );
    }

    if (this.state.isCartComplete) {
      return (
        <div className="text-center">
          Your order has already been completed, you may not checkout at this time.
        </div>
      );
    }

    return (
      <Provider store={Checkout.store}>
        <Container fluid>
          <Row>
            <Col lg={6} className="col-summary order-lg-1">
              <CartSummary resources={Checkout.resources} />
            </Col>

            <Col lg={6} className="col-checkout">
              <h1>Checkout</h1>
              <PanelManager
                layout="accordian"
                resources={Checkout.resources}
              />
            </Col>
          </Row>
        </Container>
      </Provider>
    );
  }
}
