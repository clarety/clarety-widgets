import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Row, Col } from 'react-bootstrap';
import { fetchCart } from 'checkout/actions';
import { rootReducer } from 'checkout/reducers';
import { PanelStack, CartSummary } from 'checkout/components';
import 'checkout/style.scss';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class Checkout extends React.Component {
  componentDidMount() {
    store.dispatch(fetchCart());
  }

  render() {
    return (
      <Provider store={store}>
        <Row>
          <Col lg={6} className="bg-light order-lg-1 mb-5 mb-lg-0">
            <CartSummary />
          </Col>

          <Col lg={6}>
            <h1>Checkout</h1>
            <PanelStack />
          </Col>
        </Row>
      </Provider>
    );
  }
}
