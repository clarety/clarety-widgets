import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { createMemoryHistory } from 'history';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { connect, Provider as ReduxProvider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { statuses, setStore, setTrackingData, fetchSettings, updateAppSettings } from 'shared/actions';
import { Recaptcha } from 'form/components';
import { handleUrlParams, Actions } from 'donate/actions';
import { Validations } from 'donate/validations';
import { AmountPanel, DetailsPanel, PaymentPanel, SuccessPanel } from 'donate/components';
import { createRootReducer } from 'donate/reducers';
import { mapDonationSettings, setupDefaultResources } from 'donate/utils';

export class DonateWidget extends React.Component {
  static store;
  static history;

  static init(actions = new Actions, validations = new Validations) {
    // Setup redux store.
    DonateWidget.history = createMemoryHistory();
    const reducer = createRootReducer(DonateWidget.history);

    const thunk = thunkMiddleware.withExtraArgument({ actions, validations });
    const middleware = applyMiddleware(routerMiddleware(DonateWidget.history), thunk);

    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    DonateWidget.store = createStore(reducer, composeDevTools(middleware));

    // Setup resources.
    setupDefaultResources();
  }

  render() {
    return (
      <ReduxProvider store={DonateWidget.store}>
        <DonateWidgetRoot {...this.props} history={DonateWidget.history} />
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
        <ConnectedRouter history={this.props.history}>
          <Switch>
            <Route exact path="/" render={props => <AmountPanel {...props} />}/>
            <Route path="/details" render={props => <DetailsPanel {...props} />}/>
            <Route path="/payment" render={props => <PaymentPanel {...props} />}/>
            <Route path="/success" render={props => <SuccessPanel {...props} />}/>
          </Switch>
        </ConnectedRouter>

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
