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
    const { storeCode, singleOfferCode, recurringOfferCode } = this.props;

    if (!singleOfferCode && !recurringOfferCode) throw new Error('[Clarety] Either a singleOfferCode or recurringOfferCode prop is required');
    if (!window.Stripe) throw new Error('[Clarety] Stripe not found');

    if (storeCode) updateFormData('store', storeCode);

    const params = {
      store: storeCode,
      offerSingle: singleOfferCode,
      offerRecurring: recurringOfferCode,
    };
    
    const explain = await ClaretyApi.explain('donations', params);
    if (explain) {
      setExplain(explain);
      selectDefaults(explain.offers);
      setStatus(statuses.ready);
    }
  }

  render() {
    const { status, forceMdLayout } = this.props;

    if (status === statuses.uninitialized) return null;

    return (
      <MemoryRouter>
        <Switch>
          <Route exact path="/"  render={props => (
            <this.AmountPanelClass {...props} forceMd={forceMdLayout} />)}
          />
          <Route path="/details"  render={props => (
            <this.DetailsPanelClass {...props} forceMd={forceMdLayout} />)}
          />
          <Route path="/payment"  render={props => (
            <this.PaymentPanelClass {...props} forceMd={forceMdLayout} />)}
          />
          <Route path="/success"  render={props => (
            <this.SuccessPanelClass {...props} forceMd={forceMdLayout} />)}
          />
        </Switch>
      </MemoryRouter>
    );
  }
}

// Note: An un-wrapped DonateWidget is also exported above.
export default connectDonateWidget(DonateWidget);
