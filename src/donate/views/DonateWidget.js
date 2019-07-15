import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../../shared/actions';
import { connectDonateWidget } from '../utils/connect-utils';
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
        <MemoryRouter>
          <Switch>
            <Route exact path="/"  render={props => (
              <this.AmountPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/details"  render={props => (
              <this.DetailsPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/payment"  render={props => (
              <this.PaymentPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
            <Route path="/success"  render={props => (
              <this.SuccessPanelClass {...props} forceMd={forceMdLayout} />
            )}/>
          </Switch>
        </MemoryRouter>
      </div>
    );
  }
}

// Note: An un-wrapped DonateWidget is also exported above.
export default connectDonateWidget(DonateWidget);
