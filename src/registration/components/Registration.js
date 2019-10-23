import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider as ReduxProvider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { IntlProvider, FormattedMessage } from 'react-intl';
import 'intl-pluralrules'; // Polyfill for safari 12
import { Spinner, Modal } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ClaretyApi } from 'clarety-utils';
import { statuses, setPanels, setClientIds, setAuth } from 'shared/actions';
import { PanelManager } from 'shared/components';
import { Resources, getJwtAccount } from 'shared/utils';
import { selectDefaults } from 'donate/actions';
import { Brand } from 'registration/components/misc/Brand';
import { MiniCart } from 'registration/components';
import { fetchEvents, setPriceHandles, fetchAuthCustomer } from 'registration/actions';
import { rootReducer } from 'registration/reducers';
import { priceHandles } from 'registration/utils';

const composeDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeDevTools(applyMiddleware(thunkMiddleware)));

Resources.setComponent('Brand', Brand);

export class Registration extends React.Component {
  static setPanels(panels) {
    Resources.setPanels(panels);
    store.dispatch(setPanels(panels));
  }

  static setClientIds({ dev, prod }) {
    store.dispatch(setClientIds({ dev, prod }));
  }

  render() {
    const { translations } = this.props;

    return (
      <IntlProvider locale="en" messages={translations}>
        <ReduxProvider store={store}>
          <Root />
        </ReduxProvider>
      </IntlProvider>
    );
  }
}

class _Root extends React.Component {
  async componentDidMount() {
    const { fetchEvents, selectDefaultDonations, setPriceHandles, setAuth, fetchAuthCustomer } = this.props;

    const jwtAccount = getJwtAccount();
    if (jwtAccount) {
      ClaretyApi.setAuth(jwtAccount.jwtString);
      setAuth(jwtAccount.jwtString);
      await fetchAuthCustomer();
    }

    const didFetch = await fetchEvents();
    if (!didFetch) return;

    setPriceHandles(priceHandles);
    selectDefaultDonations(priceHandles);
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
  setAuth: setAuth,
  fetchAuthCustomer: fetchAuthCustomer,

  fetchEvents: fetchEvents,
  setPriceHandles: setPriceHandles,
  selectDefaultDonations: selectDefaults,
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
