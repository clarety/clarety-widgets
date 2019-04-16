import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../../shared/actions';
import { connectDonateWidget } from '../utils/donate-utils.js';
import AmountPanel from './AmountPanel';
import DetailsPanel from './DetailsPanel';
import PaymentPanel from './PaymentPanel';
import SuccessPanel from './SuccessPanel';

export class DonateWidget extends React.Component {
  AmountPanelClass  = AmountPanel;
  DetailsPanelClass = DetailsPanel;
  PaymentPanelClass = PaymentPanel;
  SuccessPanelClass = SuccessPanel;

  async componentWillMount() {
    const { setStatus, setExplain, selectDefaults, updateFormData } = this.props;
    const { storeCode, onceOfferId, recurringOfferId } = this.props;

    if (!storeCode) throw new Error('[Clarety] storeCode prop is required');
    if (!onceOfferId) throw new Error('[Clarety] onceOfferId prop is required');
    if (!recurringOfferId) throw new Error('[Clarety] recurringOfferId prop is required');
    if (!window.Stripe) throw new Error('[Clarety] Stripe not found');

    if (storeCode) updateFormData('store', storeCode);

    const params = {
      store: storeCode,
      once: onceOfferId,
      recurring: recurringOfferId,
    };
    const explain = await ClaretyApi.explain('donations', params);
    if (explain) {
      setExplain(explain);
      selectDefaults(explain.donationOffers);
      setStatus(statuses.ready);
    }
  }

  render() {
    if (this.props.status === statuses.uninitialized) return null;

    return (
      <MemoryRouter>
        <Switch>
          <Route exact path="/"  component={this.AmountPanelClass} />
          <Route path="/details" component={this.DetailsPanelClass} />
          <Route path="/payment" component={this.PaymentPanelClass} />
          <Route path="/success" component={this.SuccessPanelClass} />
        </Switch>
      </MemoryRouter>
    );
  }
}

// Note: An un-wrapped DonateWidget is also exported above.
export default connectDonateWidget(DonateWidget);
