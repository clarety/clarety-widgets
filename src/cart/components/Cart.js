import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Col, Row } from "react-bootstrap";
import { ClaretyApi } from 'clarety-utils';
import { getJwtSession } from 'shared/utils';
import { CartHeader, CartSummary } from "cart/components";
import { cartReducer } from 'cart/reducers';
import { fetchItems } from "cart/actions";
// import 'cart/styles/main.scss';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(cartReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class Cart extends React.Component {
    componentDidMount() {
        this.refreshCart();

        // Attach a function to the window so we can refresh the cart from outside react.
        window.refreshCart = this.refreshCart;
    }

    refreshCart = () => {
        const jwtSession = getJwtSession();
        if (jwtSession) {
            ClaretyApi.setJwtSession(jwtSession.jwtString);
            store.dispatch(fetchItems(jwtSession.cartUid));
        }
    };

    render() {
        return (
            <Provider store={store}>
                <CartHeader />
                <CartSummary />
                <CartFooter />
            </Provider>
        );
    }
}

const CartFooter = () => (
    <Row className="cart-widget__footer">
        <Col sm={12} className="text-center">
            <p>Shipping, taxes, and discounts are calculated at checkout.</p>
            <a className="btn btn-primary checkout" href="/checkout">Checkout</a>
        </Col>
    </Row>
);
