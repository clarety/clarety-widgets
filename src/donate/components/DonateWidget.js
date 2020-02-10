import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { connect, Provider as ReduxProvider } from 'react-redux';
import { statuses, setStore, setTrackingData, fetchSettings, updateAppSettings, setPanels } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { handleUrlParams, Actions } from 'donate/actions';
import { Validations } from 'donate/validations';
import { rootReducer } from 'donate/reducers';
import { mapDonationSettings, setupDefaultResources } from 'donate/utils';

export class DonateWidget extends React.Component {
  static store;

  static init(actions = new Actions, validations = new Validations) {
    // Setup redux store.
    const thunk = thunkMiddleware.withExtraArgument({ actions, validations });
    const middleware = applyMiddleware(thunk);
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    DonateWidget.store = createStore(rootReducer, composeDevTools(middleware));

    // Setup resources.
    setupDefaultResources();
  }

  static setPanels(panels) {
    Resources.setPanels(panels);
    DonateWidget.store.dispatch(setPanels(panels));
  }

  render() {
    return (
      <ReduxProvider store={DonateWidget.store}>
        <DonateWidgetRoot {...this.props} />
      </ReduxProvider>
    );
  }
}

export class _DonateWidgetRoot extends React.Component {
  async componentWillMount() {
    const { updateAppSettings, setStore, setTrackingData, fetchSettings, handleUrlParams } = this.props;
    const { storeCode, singleOfferId, recurringOfferId } = this.props;
    const { sourceId, responseId, emailResponseId } = this.props;

    if (!singleOfferId && !recurringOfferId) throw new Error('[Clarety] Either a singleOfferId or recurringOfferId prop is required');

    updateAppSettings({
      variant: this.props.variant,
      forceMdLayout: !!this.props.forceMdLayout,
      confirmPageUrl: this.props.confirmPageUrl,
      showFundraising: this.props.showFundraising,
      fundraisingPageUid: this.props.fundraisingPageUid,
    });

    setStore(storeCode);
    setTrackingData({ sourceId, responseId, emailResponseId });

    await fetchSettings('donations/', {
      store: storeCode,
      offerSingle: singleOfferId,
      offerRecurring: recurringOfferId,
    }, mapDonationSettings);

    handleUrlParams();
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
      <div className="clarety-donate-widget h-100">
        <PanelManager layout="tabs" />
        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
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
  setStore: setStore,
  setTrackingData: setTrackingData,
  fetchSettings: fetchSettings,
  updateAppSettings: updateAppSettings,
  handleUrlParams: handleUrlParams,
};

export const connectDonateWidgetRoot = connect(mapStateToProps, actions);
export const DonateWidgetRoot = connectDonateWidgetRoot(_DonateWidgetRoot);
