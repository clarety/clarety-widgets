import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { setStatus, fetchExplain } from 'shared/actions';
import { formReducer } from 'form/reducers';
import { updateFormData, setErrors, clearErrors } from 'form/actions';

export function connectFormToStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
      elements: state.elements,
      formData: state.formData,
    };
  };

  const actions = {
    setStatus: setStatus,
    fetchExplain: fetchExplain,

    setErrors: setErrors,
    clearErrors: clearErrors,
    
    updateFormData: updateFormData,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(formReducer, composeDevTools(applyMiddleware(thunkMiddleware)));
  if (window.Cypress) window.store = store;

  class StoreWrapper extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedComponent {...this.props} />
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
