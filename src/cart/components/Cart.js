import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { CartSummary } from "cart/components";
import { cartReducer } from 'cart/reducers';
import { fetchItems } from "cart/actions";
import { Col, Row } from "react-bootstrap";
import 'cart/styles/main.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(fas);

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(cartReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class Cart extends React.Component {
    componentDidMount() {
        store.dispatch(fetchItems());
    }

    render() {
    return (
        <Provider store={store}>
            <div className="cart-demo">
            <CartHeader />

            <CartSummary />

            <CartFooter />
            </div>
        </Provider>
    );
  }
}

const CartHeader = () => (
    <Row className="cart-demo__header">
        <Col xs={9}>
            <FontAwesomeIcon icon="shopping-cart" /> Cart
        </Col>
        <Col xs={3} className="text-right">
            <button type="button" className="close" aria-label="Close">
                <span aria-hidden="true"><FontAwesomeIcon icon="times" /></span>
            </button>
        </Col>
    </Row>
);

//TODO need the checkout link
const CartFooter = () => (
    <Row className="cart-demo__footer">
        <Col sm={12} className="text-center">
            <p>Shipping, taxes, and discounts are calculated at checkout.</p>
            <a className="btn btn-primary" href="https://google.com.au">Checkout</a>
        </Col>
    </Row>
);