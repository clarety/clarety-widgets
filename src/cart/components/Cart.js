import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { ClaretyApi } from 'clarety-utils';
import { getJwtSession, getPath } from 'shared/utils';
import { CartHeader, CartSummary, CartFooter } from "cart/components";
import { cartReducer } from 'cart/reducers';
import { fetchItems } from "cart/actions";

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
