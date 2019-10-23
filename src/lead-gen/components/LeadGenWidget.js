import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { statuses, setPanels, setStatus, setVariant, setStore, setConfirmPageUrl, setTrackingData, setPanelSettings, setCaseTypeUid, fetchSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { SosProgress } from 'lead-gen/components';
import { rootReducer } from 'lead-gen/reducers';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class _LeadGenRoot extends React.Component {
  componentWillMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { setStatus, setVariant, setStore } = this.props;
    const { setCaseTypeUid, setConfirmPageUrl, setTrackingData, setPanelSettings, fetchSettings } = this.props;

    const { caseTypeUid, storeCode, variant, confirmPageUrl } = this.props;
    setCaseTypeUid(caseTypeUid);
    setVariant(variant);
    setStore(storeCode);
    setConfirmPageUrl(confirmPageUrl);

    const { sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceUid, responseId, emailResponseId });

    setPanelSettings('CustomerPanel', {
      title: this.props.headingText,
      subtitle: this.props.subHeadingText,
      submitBtnText: this.props.buttonText,
      showOptIn: this.props.showOptIn === '1',
      optInText: this.props.optInText,
      phoneType: this.props.phoneOption,
      addressType: this.props.addressOption,
    });

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
  setCaseTypeUid: setCaseTypeUid,
  setVariant: setVariant,
  setStore: setStore,
  setConfirmPageUrl: setConfirmPageUrl,
  setTrackingData: setTrackingData,
  setPanelSettings: setPanelSettings,
  fetchSettings: fetchSettings,
};

const LeadGenRoot = connect(mapStateToProps, actions)(_LeadGenRoot);

export class LeadGenWidget extends React.Component {
  static setPanels(panels) {
    Resources.setPanels(panels);
    store.dispatch(setPanels(panels));
  }

  render() {
    return (
      <Provider store={store}>
        <LeadGenRoot {...this.props} />
      </Provider>
    );
  }
}
