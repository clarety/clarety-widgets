import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { statuses, setPanels, setVariant, setStore, setConfirmPageUrl, setTrackingData, setPanelSettings, setCaseTypeUid, fetchSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { PanelManager } from 'shared/components';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { SosProgress } from 'lead-gen/components';
import { rootReducer } from 'lead-gen/reducers';
import { settingsMap } from 'lead-gen/utils';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class _LeadGenRoot extends React.Component {
  componentWillMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { setVariant, setStore } = this.props;
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

    fetchSettings('leadgen/', { caseTypeUid, variant }, settingsMap);
  }

  render() {
    const { status, variant, reCaptchaKey, sos } = this.props;

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
        {variant === 'sos' && <SosProgress sos={sos} />}
        <PanelManager layout="tabs" />
        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
    sos: getSetting(state, 'sos'),
  };
};

const actions = {
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
