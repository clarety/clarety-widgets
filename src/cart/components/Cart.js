import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { ClaretyApi } from 'clarety-utils';
import { getJwtSession } from 'shared/utils';
import { CartSummary } from "cart/components";
import { cartReducer } from 'cart/reducers';
import { fetchItems } from "cart/actions";
import { Col, Row } from "react-bootstrap";
// import 'cart/styles/main.scss';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(cartReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class Cart extends React.Component {
    componentDidMount() {
        const jwtSession = getJwtSession();
        ClaretyApi.setJwtSession(jwtSession.jwtString);
        store.dispatch(fetchItems(jwtSession.cartUid));
    }

    render() {
        return (
            <Provider store={store}>
                <CartSummary />
                <CartFooter />
            </Provider>
        );
    }
}

const CartFooter = () => (
    <Row className="cart-demo__footer">
        <Col sm={12} className="text-center">
            <p>Shipping, taxes, and discounts are calculated at checkout.</p>
            <a className="btn btn-primary checkout" href="/checkout">Checkout</a>
        </Col>
    </Row>
);
