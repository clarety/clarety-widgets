import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from '../reducers';
import { setElements } from '../actions/elementsActions';
import { setFormStatus } from '../actions/formStatusActions';
import { updateFormData } from '../actions/formDataActions';

export function connectStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      formStatus: state.formStatus,
      elements: state.elements,
    };
  };

  const actions = {
    setFormStatus: setFormStatus,
    setElements: setElements,
    updateFormData: updateFormData,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  class StoreWrapper extends React.Component {
    render() {
      return (
        <Provider store={createStore(rootReducer)}>
          <ConnectedComponent {...this.props } />
        </Provider>
      );
    }
  };

  StoreWrapper.displayName = `StoreWrapper(${ViewComponent.name})`;

  return StoreWrapper;
}
