import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { statuses, setPanels, setStatus, setVariant, setStore, setConfirmPageUrl, setTracking, fetchSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Recaptcha } from 'form/components';
import { SosProgress } from 'lead-gen/components';
import { rootReducer } from 'lead-gen/reducers';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

store.dispatch(setPanels([
  {
    component: 'LeadGenCustomerPanel',
    settings: {},
  }
]));

export class _LeadGenRoot extends React.Component {
  componentWillMount() {
    const { setStatus, setVariant, setStore, setConfirmPageUrl, setTracking, fetchSettings } = this.props;
    const { storeCode, variant, confirmPageUrl, reCaptchaKey } = this.props;
    const { sourceId, responseId, emailResponseId } = this.props;

    if (!reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    setVariant(variant);
    setStore(storeCode);
    setConfirmPageUrl(confirmPageUrl);
    setTracking({ sourceId, responseId, emailResponseId });

    // TODO: fetch settings when API is ready...
    // fetchSettings('lead-gen/', { store: storeCode });
    setStatus('ready');
  }

  render() {
    const { status, variant, reCaptchaKey } = this.props;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-lead-gen-widget h-100">
        <SosProgress current={900} goal={4000} />
        <PanelManager layout="tabs" />
        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
  };
};

const actions = {
  setStatus: setStatus,
  setVariant: setVariant,
  setStore: setStore,
  setConfirmPageUrl: setConfirmPageUrl,
  setTracking: setTracking,
  fetchSettings: fetchSettings,
};

const LeadGenRoot = connect(mapStateToProps, actions)(_LeadGenRoot);

export class LeadGenWidget extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <LeadGenRoot {...this.props} />
      </Provider>
    );
  }
}
