import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import formReducer from '../reducers/form-reducer';
import { setElements } from '../../shared/actions';
import { setStatus, updateData, setErrors, clearErrors } from '../actions';

export function connectFormToStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      elements: state.elements,
      status: state.status,
      formData: state.formData,
    };
  };

  const actions = {
    setStatus: setStatus,
    setElements: setElements,
    updateData: updateData,
    clearErrors: clearErrors,
    setErrors: setErrors,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  class StoreWrapper extends React.Component {
    render() {
      return (
        <Provider store={createStore(formReducer)}>
          <ConnectedComponent {...this.props } />
        </Provider>
      );
    }
  };

  StoreWrapper.displayName = `StoreWrapper(${ViewComponent.name})`;

  return StoreWrapper;
}

export const getValidationError = (property, errors) => {
  for (let error of errors) {
    if (error.field === property) return error;
  }

  return null;
};
