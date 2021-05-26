import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import i18nextHttpBackend from 'i18next-http-backend';
import { ClaretyApi } from 'clarety-utils';
import { changeLanguage } from 'shared/actions';
import { getJwtSession } from 'shared/utils';
import { CartHeader, CartSummary, CartFooter } from "cart/components";
import { cartReducer } from 'cart/reducers';
import { fetchItems } from "cart/actions";

export class Cart extends React.Component {
    static store;
    static translationsPath;

    static init() {
        const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        Cart.store = createStore(cartReducer, composeDevTools(applyMiddleware(thunkMiddleware)));
    }

    static setTranslationsPath(path) {
        Cart.translationsPath = path;
    }

    async componentDidMount() {
        // Translations.
        const { defaultLanguage } = this.props;
        const language = defaultLanguage || navigator.language || navigator.userLanguage || 'en';
        i18next.use(i18nextHttpBackend);
        await i18next.init({
            load: 'languageOnly',
            lng: language,
            fallbackLng: defaultLanguage || 'en',
            returnNull: false,
            keySeparator: false,
            backend: {
                loadPath: Cart.translationsPath,
            },
        });

        i18next.on('languageChanged', (language) => {
            this.forceUpdate();
        });

        Cart.store.dispatch(changeLanguage(language));

        this.refreshCart();

        // Attach a function to the window so we can refresh the cart from outside react.
        window.refreshCart = this.refreshCart;
    }

    refreshCart = () => {
        const jwtSession = getJwtSession();
        if (jwtSession) {
            ClaretyApi.setJwtSession(jwtSession.jwtString);
            Cart.store.dispatch(fetchItems(jwtSession.cartUid));
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
