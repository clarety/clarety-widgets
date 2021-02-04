import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { statuses, setPanels, updateAppSettings, setTrackingData, setPanelSettings, fetchSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { PanelManager } from 'shared/components';
import { Resources, getCustomerPanelSettingsFromWidgetProps } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { rootReducer } from 'prayers-praises/reducers';
import { settingsMap } from 'prayers-praises/utils';
import { getIsShowingConfirmation } from 'prayers-praises/selectors';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class _PrayersPraisesRoot extends React.Component {
  componentWillMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { updateAppSettings, setTrackingData, setPanelSettings, fetchSettings } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      caseTypeUid: this.props.caseTypeUid,
      confirmPageUrl: this.props.confirmPageUrl,
    });

    const { sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceUid, responseId, emailResponseId });

    const customerPanelSettings = getCustomerPanelSettingsFromWidgetProps(this.props);
    setPanelSettings('CustomerPanel', customerPanelSettings);

    const { caseTypeUid } = this.props;
    fetchSettings('prayerspraises/', { caseTypeUid }, settingsMap);
  }

  render() {
    const { status, reCaptchaKey } = this.props;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className={`clarety-prayers-praises-widget h-100`}>
        <PanelManager layout="tabs" />
        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
    isShowingConfirmation: getIsShowingConfirmation(state),
  };
};

const actions = {
  updateAppSettings: updateAppSettings,
  setTrackingData: setTrackingData,
  setPanelSettings: setPanelSettings,
  fetchSettings: fetchSettings,
};

const PrayersPraisesRoot = connect(mapStateToProps, actions)(_PrayersPraisesRoot);

export class PrayersPraisesWidget extends React.Component {
  static setPanels(panels) {
    Resources.setPanels(panels);
    store.dispatch(setPanels(panels));
  }

  render() {
    return (
      <Provider store={store}>
        <PrayersPraisesRoot {...this.props} />
      </Provider>
    );
  }
}
