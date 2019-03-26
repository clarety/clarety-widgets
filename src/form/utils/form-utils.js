import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import formReducer from '../reducers/form-Reducer';
import { setElements } from '../../shared/actions/elements-actions';
import { setStatus } from '../actions/form-status-actions';
import { updateData } from '../actions/form-data-actions';
import { setValidationErrors, clearValidationErrors } from '../actions/form-errors-actions';

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
