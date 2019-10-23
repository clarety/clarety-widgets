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

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class Checkout extends React.Component {
  state = { isReady: false, isCartComplete: false };

  static setPanels(panels) {
    Resources.setPanels(panels);
    store.dispatch(setPanels(panels));
  }

  static setClientIds({ dev, prod }) {
    store.dispatch(setClientIds({ dev, prod }));
  }

  async componentDidMount() {
    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      ClaretyApi.setAuth(jwtAccount.jwtString);
      store.dispatch(setAuth(jwtAccount.jwtString));
      await store.dispatch(fetchCustomer(jwtAccount.customer_uid));
    }

    const jwtSession = getJwtSession();
    if (jwtSession) {
      ClaretyApi.setJwtSession(jwtSession.jwtString);
      await store.dispatch(fetchCart(jwtSession.cartUid));
      const state = store.getState();
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
      <Provider store={store}>
        <Container fluid>
          <Row>
            <Col lg={6} className="col-summary order-lg-1">
              <CartSummary />
            </Col>

            <Col lg={6} className="col-checkout">
              <h1>Checkout</h1>
              <PanelManager layout="accordian" />
            </Col>
          </Row>
        </Container>
      </Provider>
    );
  }
}
