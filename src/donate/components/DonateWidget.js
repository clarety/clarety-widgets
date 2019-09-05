import React from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom';
import { statuses, setStore } from 'shared/actions';
import { connectDonateWidget } from 'donate/utils';
import { AmountPanel, DetailsPanel, PaymentPanel, SuccessPanel } from 'donate/components';

export class _DonateWidget extends React.Component {
  AmountPanelClass  = AmountPanel;
  DetailsPanelClass = DetailsPanel;
  PaymentPanelClass = PaymentPanel;
  SuccessPanelClass = SuccessPanel;

  componentWillMount() {
    const { fetchExplain, setStore } = this.props;
    const { storeCode, singleOfferCode, recurringOfferCode } = this.props;

    if (!singleOfferCode && !recurringOfferCode) throw new Error('[Clarety] Either a singleOfferCode or recurringOfferCode prop is required');
    if (!window.Stripe) throw new Error('[Clarety] Stripe not found');

    setStore(storeCode);

    fetchExplain('donations/', {
      store: storeCode,
      offerSingle: singleOfferCode,
      offerRecurring: recurringOfferCode,
    });
  }

  render() {
    const { status, forceMdLayout } = this.props;

    // Show a loading indicator while we init.
    if (status === statuses.uninitialized) {
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
            <Route exact path="/" render={props => (
              <this.AmountPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/details" render={props => (
              <this.DetailsPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/payment" render={props => (
              <this.PaymentPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/success" render={props => (
              <this.SuccessPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
          </Switch>
        </ConnectedRouter>
      </div>
    );
  }
}

export const DonateWidget = connectDonateWidget(_DonateWidget);
