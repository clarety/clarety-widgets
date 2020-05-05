import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connect, Provider as ReduxProvider } from 'react-redux';
import { BreakpointProvider } from 'react-socks';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { statuses, setStore, setTrackingData, fetchSettings, updateAppSettings, setPanels } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { getJwtCustomer, Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { handleUrlParams } from 'donate/actions';
import { rootReducer } from 'donate/reducers';
import { mapDonationSettings, setupDefaultResources } from 'donate/utils';
import { StepIndicator } from 'donate/components';
import { fetchCustomer } from 'donate/actions/customer-actions';
import { ClaretyApi } from "clarety-utils"

export class DonateWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup redux store.
    const middleware = applyMiddleware(thunk);
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    DonateWidget.store = createStore(rootReducer, composeDevTools(middleware));

    // Setup resources.
    DonateWidget.resources = new Resources();
    setupDefaultResources(DonateWidget.resources);
  }

  static appSettings(settings) {
    DonateWidget.store.dispatch(updateAppSettings(settings));
  }

  static setPanels(panels) {
    DonateWidget.resources.setPanels(panels);
    DonateWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    DonateWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <ReduxProvider store={DonateWidget.store}>
        <BreakpointProvider>
          <DonateWidgetRoot
            resources={DonateWidget.resources}
            {...this.props}
          />
        </BreakpointProvider>
      </ReduxProvider>
    );
  }
}

export class _DonateWidgetRoot extends React.Component {
  async componentWillMount() {
    const { updateAppSettings, setStore, setTrackingData, fetchSettings, handleUrlParams, fetchCustomer } = this.props;
    const { storeUid, singleOfferId, recurringOfferId } = this.props;
    const { sourceId, responseId, emailResponseId } = this.props;
    const { variant, confirmPageUrl, fundraisingPageUid } = this.props;

    if (!singleOfferId && !recurringOfferId) throw new Error('[Clarety] Either a singleOfferId or recurringOfferId prop is required');

    let givingTypeOptions = undefined;
    if(this.props.givingTypeOptions) {
      givingTypeOptions = this.props.givingTypeOptions.map(option => ({value:option, label:option}));
    }

    updateAppSettings({
      variant: variant,
      confirmPageUrl: confirmPageUrl,
      fundraisingPageUid: fundraisingPageUid,
      givingTypeOptions: givingTypeOptions,
    });

    setStore(storeUid);
    setTrackingData({ sourceId, responseId, emailResponseId });

    const jwtCustomer = getJwtCustomer();
    if (jwtCustomer) {
      ClaretyApi.setJwtCustomer(jwtCustomer.jwtString);
      await fetchCustomer();
    }

    await fetchSettings('donations/', {
      storeUid: storeUid,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
    }, mapDonationSettings);

    handleUrlParams();
  }

  render() {
    const { status, reCaptchaKey, showStepIndicator, layout } = this.props;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }
    return (
      <div className={`clarety-donate-widget h-100 ${layout}`}>
        <BlockUi tag="div" blocking={status === statuses.busy} loader={<span></span>}>
          {showStepIndicator && <StepIndicator />}

          <PanelManager
            layout={layout || 'tabs'}
            resources={this.props.resources}
          />
        </BlockUi>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status
  };
};

const actions = {
  setStore: setStore,
  setTrackingData: setTrackingData,
  fetchSettings: fetchSettings,
  updateAppSettings: updateAppSettings,
  handleUrlParams: handleUrlParams,
  fetchCustomer: fetchCustomer,
};

export const connectDonateWidgetRoot = connect(mapStateToProps, actions);
export const DonateWidgetRoot = connectDonateWidgetRoot(_DonateWidgetRoot);
