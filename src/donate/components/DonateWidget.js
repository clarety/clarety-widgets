import React from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom';
import { statuses } from 'shared/actions';
import { OverrideContext } from 'shared/utils';
import { connectDonateWidget } from 'donate/utils';
import { AmountPanel, DetailsPanel, PaymentPanel, SuccessPanel } from 'donate/components';

export class _DonateWidget extends React.Component {
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

    const AmountPanelComponent  = this.context.AmountPanel  || AmountPanel;
    const DetailsPanelComponent = this.context.DetailsPanel || DetailsPanel;
    const PaymentPanelComponent = this.context.PaymentPanel || PaymentPanel;
    const SuccessPanelComponent = this.context.SuccessPanel || SuccessPanel;

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
              <AmountPanelComponent {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/details" render={props => (
              <DetailsPanelComponent {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/payment" render={props => (
              <PaymentPanelComponent {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/success" render={props => (
              <SuccessPanelComponent {...props} forceMd={forceMdLayout} />
            )}/>
          </Switch>
        </ConnectedRouter>
      </div>
    );
  }
}

_DonateWidget.contextType = OverrideContext;

export const DonateWidget = connectDonateWidget(_DonateWidget);
