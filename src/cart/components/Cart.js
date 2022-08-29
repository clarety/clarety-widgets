import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { ClaretyApi } from 'clarety-utils';
import { getJwtSession } from 'shared/utils';
import { CartHeader, CartSummary, CartFooter } from "cart/components";
import { cartReducer } from 'cart/reducers';
import { fetchItems } from "cart/actions";

export class Cart extends React.Component {
    static store;

    static init() {
        const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        Cart.store = createStore(cartReducer, composeDevTools(applyMiddleware(thunkMiddleware)));
    }

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

        this.refreshCart();

        // Attach a function to the window so we can refresh the cart from outside react.
        window.refreshCart = this.refreshCart;
    }

    refreshCart = () => {
        const jwtSession = getJwtSession();
        if (jwtSession) {
            ClaretyApi.setJwtSession(jwtSession.jwtString);
            Cart.store.dispatch(fetchItems(jwtSession.cartUid, this.props.defaultLanguage));
        }
    };

    render() {
        return (
            <Provider store={Cart.store}>
                <CartHeader />
                <CartSummary />
                <CartFooter />
            </Provider>
        );
    }
}
