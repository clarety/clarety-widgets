import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { createMemoryHistory } from 'history';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { Provider as ReduxProvider } from 'react-redux';
import BlockUi from 'react-block-ui';
import { statuses } from 'shared/actions';
import { Recaptcha } from 'form/components';
import { _DonateWidgetRoot, connectDonateWidgetRoot } from 'donate/components';
import { PageAmountPanel, PageFundraisingPanel, PageDetailsPanel, PagePaymentPanel } from 'donate/components';
import { OverrideContext } from 'shared/utils';
import { PageActions } from 'donate/actions';
import { Validations } from 'donate/validations';
import { createRootReducer } from 'donate/reducers';

export class DonatePage extends React.Component {
  static store;
  static components;
  static history;

  static init(components, actions, validations) {
    DonatePage.components = components || {};
    actions = actions || new PageActions;
    validations = validations || new Validations;

    // Setup redux store.
    DonatePage.history = createMemoryHistory();
    const reducer = createRootReducer(DonatePage.history);

    const thunk = thunkMiddleware.withExtraArgument({ actions, validations });
    const middleware = applyMiddleware(routerMiddleware(DonatePage.history), thunk);

    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    DonatePage.store = createStore(reducer, composeDevTools(middleware));
  }

  render() {
    return (
      <ReduxProvider store={DonatePage.store}>
        <OverrideContext.Provider value={DonatePage.components}>
          <DonatePageRoot {...this.props} history={DonatePage.history} />
        </OverrideContext.Provider>
      </ReduxProvider>
    );
  }
}

export class _DonatePageRoot extends _DonateWidgetRoot {
  render() {
    const { status, variant, showFundraising, reCaptchaKey } = this.props;

    const AmountPanelComponent      = this.context.AmountPanel      || PageAmountPanel;
    const DetailsPanelComponent     = this.context.DetailsPanel     || PageDetailsPanel;
    const FundraisingPanelComponent = this.context.FundraisingPanel || PageFundraisingPanel;
    const PaymentPanelComponent     = this.context.PaymentPanel     || PagePaymentPanel;

    // Show a loading indicator while we init.
    if (status === statuses.initializing) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-donate-page">
        <BlockUi tag="div" blocking={status !== statuses.ready} loader={<span></span>}>
          <AmountPanelComponent  variant={variant} />
          <DetailsPanelComponent variant={variant} />
          {showFundraising && <FundraisingPanelComponent variant={variant} />}
          <PaymentPanelComponent variant={variant} />
        </BlockUi>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
      </div>
    );
  }
}

const DonatePageRoot = connectDonateWidgetRoot(_DonatePageRoot);
