import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider as ReduxProvider } from 'react-redux';
import BlockUi from 'react-block-ui';
import { statuses, setPanels } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources } from 'shared/utils';
import { Recaptcha } from 'form/components';
import { _DonateWidgetRoot, connectDonateWidgetRoot } from 'donate/components';
import { PageActions } from 'donate/actions';
import { Validations } from 'donate/validations';
import { rootReducer } from 'donate/reducers';
import { setupDefaultResources } from 'donate/utils';

export class DonatePage extends React.Component {
  static store;

  static init(actions = new PageActions, validations = new Validations) {
    // Setup redux store.
    const thunk = thunkMiddleware.withExtraArgument({ actions, validations });
    const middleware = applyMiddleware(thunk);
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    DonatePage.store = createStore(rootReducer, composeDevTools(middleware));

    // Setup resources.
    setupDefaultResources();
  }

  static setPanels(panels) {
    Resources.setPanels(panels);
    DonatePage.store.dispatch(setPanels(panels));
  }

  render() {
    return (
      <ReduxProvider store={DonatePage.store}>
        <DonatePageRoot {...this.props} />
      </ReduxProvider>
    );
  }
}

export class _DonatePageRoot extends _DonateWidgetRoot {
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
      <div className="clarety-donate-page">
        <BlockUi tag="div" blocking={status !== statuses.ready} loader={<span></span>}>
          <PanelManager layout="page" />
        </BlockUi>

        {reCaptchaKey && <Recaptcha siteKey={reCaptchaKey} />}
      </div>
    );
  }
}

const DonatePageRoot = connectDonateWidgetRoot(_DonatePageRoot);
