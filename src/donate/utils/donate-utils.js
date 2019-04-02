import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import donateReducer from '../reducers/donate-reducer';
import { setElements } from '../../shared/actions';
import { setStatus } from '../../form/actions';
import { setSuggestedDonations, selectDefaults } from '../actions';

export function connectDonateWidgetToStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      elements: state.elements,
      suggestedDonations: state.suggestedDonations,
      status: state.status,
    };
  };

  const actions = {
    setStatus: setStatus,
    setElements: setElements,
    setSuggestedDonations: setSuggestedDonations,
    selectDefaults: selectDefaults,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  class StoreWrapper extends React.Component {
    render() {
      return (
        <Provider store={createStore(donateReducer)}>
          <ConnectedComponent {...this.props } />
        </Provider>
      );
    }
  };

  StoreWrapper.displayName = `StoreWrapper(${ViewComponent.name})`;

  return StoreWrapper;
};
