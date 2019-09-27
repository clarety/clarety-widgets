import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Container, Row, Col } from 'react-bootstrap';
import { ClaretyApi } from 'clarety-utils';
import { getJwtSession } from 'shared/utils';
import { fetchCart } from 'checkout/actions';
import { rootReducer } from 'checkout/reducers';
import { PanelStack, CartSummary } from 'checkout/components';
import 'checkout/style.scss';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class Checkout extends React.Component {
  componentDidMount() {
    const jwtSession = getJwtSession();
    ClaretyApi.setJwtSession(jwtSession);
    store.dispatch(fetchCart(jwtSession.cartUid));
  }

  render() {
    return (
      <Provider store={store}>
        <Container fluid>
          <Row>
            <Col lg={6} className="col-summary order-lg-1">
              <CartSummary />
            </Col>

            <Col lg={6} className="col-checkout">
              <h1>Checkout</h1>
              <PanelStack />
            </Col>
          </Row>
        </Container>
      </Provider>
    );
  }
}
