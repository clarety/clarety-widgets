import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { SalelineList } from "cart/components";
import { cartReducer } from 'cart/reducers';
import { fetchSalelines } from "cart/actions";

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(cartReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class Cart extends React.Component {
    componentDidMount() {
        store.dispatch(fetchSalelines());
    }

    render() {
    return (
        <Provider store={store}>
            <p>Header [X]</p>

            <SalelineList />

            <p>Summary Total</p>

            <p>Footer</p>
        </Provider>
    );
  }
}