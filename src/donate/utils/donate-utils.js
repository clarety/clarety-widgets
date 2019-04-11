import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import donateReducer from '../reducers/donate-reducer';
import * as sharedActions from '../../shared/actions';
import * as formActions from '../../form/actions';
import * as donateActions from '../actions';

export function connectDonateWidgetToStore(ViewComponent) {
  const mapStateToProps = state => {
    return {
      status: state.status,
    };
  };

  const actions = {
    setStatus: sharedActions.setStatus,
    setExplain: sharedActions.setExplain,
    updateFormData: formActions.updateFormData,
    selectDefaults: donateActions.selectDefaults,
  };

  const ConnectedComponent = connect(mapStateToProps, actions)(ViewComponent);

  class StoreWrapper extends React.Component {
    render() {
      const store = createStore(donateReducer);
      if (window.Cypress) window.store = store;

      return (
        <Provider store={store}>
          <ConnectedComponent { ...this.props } />
        </Provider>
      );
    }
  };

  StoreWrapper.displayName = `StoreWrapper(${ViewComponent.name})`;

  return StoreWrapper;
};
