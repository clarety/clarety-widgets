import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { statuses, setPanels, updateAppSettings, setTrackingData, setPanelSettings, fetchSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { PanelManager } from 'shared/components';
import { Resources, getCustomerPanelSettingsFromWidgetProps } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { SosProgress, ImageHeader } from 'lead-gen/components';
import { rootReducer } from 'lead-gen/reducers';
import { settingsMap } from 'lead-gen/utils';
import { getIsShowingConfirmation } from 'lead-gen/selectors';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export class _LeadGenRoot extends React.Component {
  componentWillMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    const { updateAppSettings, setTrackingData, setPanelSettings, fetchSettings } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      caseTypeUid: this.props.caseTypeUid,
      variant: this.props.variant,
      confirmPageUrl: this.props.confirmPageUrl,
    });

    const { sourceUid, responseId, emailResponseId } = this.props;
    setTrackingData({ sourceUid, responseId, emailResponseId });

    const customerPanelSettings = getCustomerPanelSettingsFromWidgetProps(this.props);
    setPanelSettings('CustomerPanel', customerPanelSettings);

    const { caseTypeUid, variant } = this.props;
    fetchSettings('leadgen/', { caseTypeUid, variant }, settingsMap);
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
        {variant === 'sos' && this.renderSosHeader()}
        {variant === 'download' && this.renderDownloadHeader()}

        <PanelManager layout="tabs" />
        <Recaptcha siteKey={reCaptchaKey} />
      </div>
    );
  }

  renderSosHeader() {
    return <SosProgress sos={this.props.sos} />;
  }

  renderDownloadHeader() {
    const { download, headingText, subHeadingText, isShowingConfirmation } = this.props;

    if (isShowingConfirmation) return null;

    return (
      <ImageHeader
        title={headingText}
        subtitle={subHeadingText}
        image={download.image}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
    sos: getSetting(state, 'sos'),
    download: getSetting(state, 'download'),
    isShowingConfirmation: getIsShowingConfirmation(state),
  };
};

const actions = {
  updateAppSettings: updateAppSettings,
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
