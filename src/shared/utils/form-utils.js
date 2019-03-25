import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { setStatus } from '../actions/formStatusActions';
import { setElements } from '../actions/elementsActions';
import { updateData } from '../actions/formDataActions';
import { setValidationErrors, clearValidationErrors } from '../actions/formErrorsActions';
import formReducer from '../reducers/formReducer';

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
