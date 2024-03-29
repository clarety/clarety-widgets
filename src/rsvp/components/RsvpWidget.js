import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import i18next from 'i18next';
import BlockUi from 'react-block-ui';
import { setStatus, setPanels, setClientIds, updateAppSettings, initTrackingData, fetchSettings } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources } from 'shared/utils';
import { Recaptcha, ErrorMessages } from 'form/components';
import { rootReducer } from 'rsvp/reducers';
import { settingsMap } from 'rsvp/utils';

export class RsvpWidget extends React.Component {
  static store;
  static resources;

  static init() {
    // Setup store.
    const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    RsvpWidget.store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

    // Setup resources.
    RsvpWidget.resources = new Resources();
  }

  static setClientIds({ dev, prod }) {
    RsvpWidget.store.dispatch(setClientIds({ dev, prod }));
  }

  static setPanels(panels) {
    RsvpWidget.resources.setPanels(panels);
    RsvpWidget.store.dispatch(setPanels(panels));
  }

  static setComponent(name, component) {
    RsvpWidget.resources.setComponent(name, component);
  }

  render() {
    return (
      <Provider store={RsvpWidget.store}>
        <RsvpWidgetRoot
          resources={RsvpWidget.resources}
          {...this.props}
        />
      </Provider>
    );
  }
}

export class _RsvpWidgetRoot extends React.Component {
  state = { isInitialising: true };

  async componentDidMount() {
    if (!this.props.reCaptchaKey) throw new Error('[Clarety] missing reCaptcha key');

    i18next.init();

    const { updateAppSettings, initTrackingData, setStatus, fetchSettings } = this.props;

    updateAppSettings({
      widgetElementId: this.props.elementId,
      storeUid: this.props.storeUid,
      confirmPageUrl: this.props.confirmPageUrl,
      variant: this.props.variant,
    });

    initTrackingData(this.props);

    const { storeUid, eventUid } = this.props;
    await fetchSettings('events/rsvp/', { storeUid, eventUid }, settingsMap);

    setStatus('ready');
    this.setState({ isInitialising: false });
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
      <div className="clarety-rsvp-widget">
        <BlockUi tag="div" blocking={this.props.isBusy} loader={<span></span>}>
          <ErrorMessages />
          <PanelManager layout="accordian" resources={this.props.resources} />
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
  fetchSettings: fetchSettings,
};

const RsvpWidgetRoot = connect(mapStateToProps, actions)(_RsvpWidgetRoot);
