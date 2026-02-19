import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import BlockUi from 'react-block-ui';
import { setStatus, setPanels, setStore, updateAppSettings, initTrackingData, fetchSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources } from 'shared/utils';
import { ClaretyApi } from 'shared/utils/clarety-api';
import { Recaptcha } from 'form/components';
import { rootReducer } from 'update-payment-details/reducers';
import { settingsMap } from 'update-payment-details/utils';

export class UpdatePaymentDetailsWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    UpdatePaymentDetailsWidget.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    UpdatePaymentDetailsWidget.resources = new Resources();
  }

  static setPanels(panels) {
    UpdatePaymentDetailsWidget.resources.setPanels(panels);
    UpdatePaymentDetailsWidget.store.dispatch(setPanels(panels));
  }

  render() {
    return (
      <Provider store={UpdatePaymentDetailsWidget.store}>
        <UpdatePaymentDetailsWidgetRoot
          resources={UpdatePaymentDetailsWidget.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _UpdatePaymentDetailsWidgetRoot extends React.Component {
  state = { isInitialising: true };

  async componentDidMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    i18next.init();

    const { updateAppSettings, initTrackingData, setStatus, setStore, fetchSettings, storeUid } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
    });

    setStore(storeUid);
    initTrackingData(this.props);

    const didAuth = await this.findAndAttemptAuth();
    if (didAuth) {
      await fetchSettings('update-payment-details/', { storeUid }, settingsMap);
    } else {
      updateAppSettings({ hasAuthError: true });
    }

    setStatus('ready');
    this.setState({ isInitialising: false });
  }

  async findAndAttemptAuth() {
    // Check for action auth key in widget props.
    let actionKey = this.props.actionKey;

    // Check for action auth url param.
    if (!actionKey) {
      const urlParams = new URLSearchParams(window.location.search);
      actionKey = urlParams.get('clarety_action');
    }

    // if we found a key, attempt to exchange for a jwt.
    if (actionKey) {
      const response = await ClaretyApi.get('update-payment-details/action-auth', { actionKey });
      const actionAuth = response[0] || null;
  
      if (actionAuth?.jwtCustomer) {
        ClaretyApi.setJwtCustomer(actionAuth.jwtCustomer);
        return true;
      }
    }

    return false;
  }

  render() {
    // Show a loading indicator while we init.
    if (this.state.isInitialising) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    return (
      <div className="clarety-update-payment-details-widget">
        <BlockUi tag="div" blocking={this.props.isBusy} loader={<span></span>}>
          <PanelManager layout="tabs" resources={this.props.resources} />
          <Recaptcha siteKey={this.props.reCaptchaKey} language={i18next.language} />
        </BlockUi>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isBusy: state.status !== 'ready',
  };
};

const actions = {
  updateAppSettings: updateAppSettings,
  initTrackingData: initTrackingData,
  setStatus: setStatus,
  setStore: setStore,
  fetchSettings: fetchSettings,
};

const UpdatePaymentDetailsWidgetRoot = connect(mapStateToProps, actions)(_UpdatePaymentDetailsWidgetRoot);
