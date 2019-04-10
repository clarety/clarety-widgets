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
      return (
        <Provider store={createStore(donateReducer)}>
          <ConnectedComponent { ...this.props } />
        </Provider>
      );
    }
  };

  StoreWrapper.displayName = `StoreWrapper(${ViewComponent.name})`;

  return StoreWrapper;
};
