import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider as ReduxProvider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { IntlProvider, FormattedMessage } from 'react-intl';
import 'intl-pluralrules'; // Polyfill for safari 12
import { Spinner, Modal } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { panels, pushPanel } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { selectDefaults } from 'donate/actions';
import { MiniCart } from 'registrations/components';
import { fetchEvents, statuses, setPriceHandles } from 'registrations/actions';
import { rootReducer } from 'registrations/reducers';
import { priceHandles } from 'registrations/utils';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

export const Registrations = ({ translations }) => (
  <IntlProvider locale="en" messages={translations}>
    <ReduxProvider store={store}>
      <Root />
    </ReduxProvider>
  </IntlProvider>
);

class _Root extends React.Component {
  async componentDidMount() {
    const { fetchEvents, selectDefaultDonations, setPriceHandles, pushPanel } = this.props;

    const didFetch = await fetchEvents();
    if (!didFetch) return;

    setPriceHandles(priceHandles);
    selectDefaultDonations(priceHandles);

    // TODO: remove!
    pushPanel({ panel: panels.eventPanel, progress: 0 });
  }

  render() {
    return (
      <BlockUi blocking={this.props.isBlocking} loader={this.getLoader()}>
        <MiniCart />
        <PanelManager layout="stack" />
      </BlockUi>
    );
  }

  getLoader() {
    const { isInitializing, isValidating, isSubmitting } = this.props;

    if (isInitializing) return <BusyOverlay messageId="busy.init" />;
    if (isValidating)   return <BusyOverlay messageId="busy.validate" />;
    if (isSubmitting)   return <BusyOverlay messageId="busy.submit" />;

    return <span />;
  }
}

const mapStateToProps = state => {
  return {
    isBlocking: state.status !== statuses.ready,
    isInitializing: state.status === statuses.initializing,
    isValidating: state.status === statuses.validating,
    isSubmitting: state.status === statuses.submitting,
  };
};

const actions = {
  fetchEvents: fetchEvents,
  setPriceHandles: setPriceHandles,
  selectDefaultDonations: selectDefaults,
  pushPanel: pushPanel,
};

const Root = connect(mapStateToProps, actions)(_Root);

const BusyOverlay = ({ messageId }) => (
  <Modal.Dialog>
    <Modal.Body>
      <FormattedMessage id={messageId} tagName="h5" />
      <Spinner animation="border" className="mt-3" />
    </Modal.Body>
  </Modal.Dialog>
);
