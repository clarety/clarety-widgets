import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import formReducer from '../reducers/form-reducer';
import { setElements } from '../../shared/actions';
import { setStatus, updateData, setValidationErrors, clearValidationErrors } from '../actions';

export function connectFormToStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      elements: state.elements,
      status: state.status,
      formData: state.data,
    };
  };

  const actions = {
    setStatus: setStatus,
    setElements: setElements,
    updateData: updateData,
    clearValidationErrors: clearValidationErrors,
    setValidationErrors: setValidationErrors,
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
