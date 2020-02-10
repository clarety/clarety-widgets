import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { createMemoryHistory } from 'history';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { connect, Provider as ReduxProvider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { statuses, setStore, setTrackingData, fetchSettings, updateAppSettings } from 'shared/actions';
import { OverrideContext } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { handleUrlParams, Actions } from 'donate/actions';
import { Validations } from 'donate/validations';
import { AmountPanel, DetailsPanel, PaymentPanel, SuccessPanel } from 'donate/components';
import { createRootReducer } from 'donate/reducers';
import { mapDonationSettings } from 'donate/utils';

export class DonateWidget extends React.Component {
  static store;
  static components;
  static history;

  static init(components, actions, validations) {
    DonateWidget.components = components || {};
    actions = actions || new Actions;
    validations = validations || new Validations;

    // Setup redux store.
    DonateWidget.history = createMemoryHistory();
    const reducer = createRootReducer(DonateWidget.history);

    const thunk = thunkMiddleware.withExtraArgument({ actions, validations });
    const middleware = applyMiddleware(routerMiddleware(DonateWidget.history), thunk);

    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    DonateWidget.store = createStore(reducer, composeDevTools(middleware));
  }

  render() {
    return (
      <ReduxProvider store={DonateWidget.store}>
        <OverrideContext.Provider value={DonateWidget.components}>
          <DonateWidgetRoot {...this.props} history={DonateWidget.history} />
        </OverrideContext.Provider>
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

    const AmountPanelComponent  = this.context.AmountPanel  || AmountPanel;
    const DetailsPanelComponent = this.context.DetailsPanel || DetailsPanel;
    const PaymentPanelComponent = this.context.PaymentPanel || PaymentPanel;
    const SuccessPanelComponent = this.context.SuccessPanel || SuccessPanel;

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
        <ConnectedRouter history={this.props.history}>
          <Switch>
            <Route exact path="/" render={props => <AmountPanelComponent {...props} />}/>
            <Route path="/details" render={props => <DetailsPanelComponent {...props} />}/>
            <Route path="/payment" render={props => <PaymentPanelComponent {...props} />}/>
            <Route path="/success" render={props => <SuccessPanelComponent {...props} />}/>
          </Switch>
        </ConnectedRouter>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
      </div>
    );
  }
}

_DonateWidgetRoot.contextType = OverrideContext;

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
