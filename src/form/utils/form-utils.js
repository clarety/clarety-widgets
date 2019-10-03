import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { createMemoryHistory } from 'history';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { Provider, connect } from 'react-redux';
import { fetchSettings } from 'shared/actions';
import { createFormReducer } from 'form/reducers';
import { submitForm } from 'form/actions';

export function connectFormToStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
      elements: state.elements,
      formData: state.formData,
    };
  };

  const actions = {
    fetchSettings: fetchSettings,
    submitForm: submitForm,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  const history = createMemoryHistory();
  const middleware = applyMiddleware(routerMiddleware(history), thunkMiddleware);
  const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(createFormReducer(history), composeDevTools(middleware));

  if (window.Cypress) window.store = store;

  class StoreWrapper extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedComponent
            {...this.props}
            history={history}
          />
        </Provider>
      );
    }
  };

  StoreWrapper.displayName = `StoreWrapper(${ViewComponent.name})`;

  return StoreWrapper;
}

export const getValidationError = (field, errors) => {
  for (let error of errors) {
    if (error.field === field) return error;
  }

  return null;
};
