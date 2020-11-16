import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import { statuses, setPanels, updateAppSettings, initTrackingData, setPanelSettings, fetchSettings } from 'shared/actions';
import { getSetting } from 'shared/selectors';
import { PanelManager } from 'shared/components';
import { Resources, getCustomerPanelSettingsFromWidgetProps } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { SosProgress, ImageHeader } from 'lead-gen/components';
import { rootReducer } from 'lead-gen/reducers';
import { settingsMap } from 'lead-gen/utils';
import { getIsShowingConfirmation } from 'lead-gen/selectors';

export class LeadGenWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    LeadGenWidget.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    LeadGenWidget.resources = new Resources();
  }

  static setPanels(panels) {
    LeadGenWidget.resources.setPanels(panels);
    LeadGenWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    LeadGenWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <Provider store={LeadGenWidget.store}>
        <LeadGenRoot
          resources={LeadGenWidget.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _LeadGenRoot extends React.Component {
  componentWillMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');
    
    const { updateAppSettings, initTrackingData, setPanelSettings, fetchSettings } = this.props;

    i18next.init();

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeCode: this.props.storeCode,
      caseTypeUid: this.props.caseTypeUid,
      caseStage: this.props.caseStage,
      variant: this.props.variant,
      confirmPageUrl: this.props.confirmPageUrl,
    });

    initTrackingData(this.props);

    const customerPanelSettings = getCustomerPanelSettingsFromWidgetProps(this.props);
    setPanelSettings('CustomerPanel', customerPanelSettings);

    const { caseTypeUid, variant } = this.props;
    fetchSettings('leadgen/', { caseTypeUid, variant }, settingsMap);
  }

  render() {
    const { status, variant, resources, reCaptchaKey } = this.props;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className={`clarety-lead-gen-widget h-100 ${variant}`}>
        {variant === 'sos' && this.renderSosHeader()}
        {variant === 'download' && this.renderDownloadHeader()}

        <PanelManager layout="tabs" resources={resources} />
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
  initTrackingData: initTrackingData,
  setPanelSettings: setPanelSettings,
  fetchSettings: fetchSettings,
};

const LeadGenRoot = connect(mapStateToProps, actions)(_LeadGenRoot);
