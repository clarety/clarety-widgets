import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import formReducer from '../reducers/form-reducer';
import * as sharedActions from '../../shared/actions';
import * as formActions from '../actions';

export function connectFormToStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
      elements: state.elements,
      formData: state.formData,
    };
  };

  const actions = {
    setStatus: sharedActions.setStatus,
    setExplain: sharedActions.setExplain,

    setErrors: formActions.setErrors,
    clearErrors: formActions.clearErrors,
    
    updateFormData: formActions.updateFormData,
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

export const getValidationError = (field, errors) => {
  for (let error of errors) {
    if (error.field === field) return error;
  }

  return null;
};
