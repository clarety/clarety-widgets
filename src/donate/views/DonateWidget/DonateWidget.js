import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import ClaretyApi from '../../../shared/services/clarety-api';
import { statuses } from '../../../shared/actions';
import { connectDonateWidgetToStore } from '../../utils/donate-utils.js';
import AmountPanel from './AmountPanel';
import DetailsPanel from './DetailsPanel';
import PaymentPanel from './PaymentPanel';
import SuccessPanel from './SuccessPanel';

export class DonateWidget extends React.Component {
  async componentWillMount() {
    const { setStatus, setExplain, selectDefaults, updateFormData } = this.props;
    const { storeCode, onceOfferId, recurringOfferId } = this.props;

    if (!storeCode) throw new Error('[Clarety] storeCode prop is required');
    if (!onceOfferId) throw new Error('[Clarety] onceOfferId prop is required');
    if (!recurringOfferId) throw new Error('[Clarety] recurringOfferId prop is required');

    updateFormData('store', storeCode);

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
          <Route exact path="/" render={this.renderAmountPanel} />
          <Route path="/details" render={this.renderDetailsPanel} />
          <Route path="/payment" render={this.renderPaymentPanel} />
          <Route path="/success" render={this.renderSuccessPanel} />
        </Switch>
      </MemoryRouter>
    );
  }

  renderAmountPanel(props) {
    return <AmountPanel {...props} />;
  }

  renderDetailsPanel(props) {
    return <DetailsPanel {...props} />;
  }

  renderPaymentPanel(props) {
    return <PaymentPanel {...props} />;
  }

  renderSuccessPanel(props) {
    return <SuccessPanel {...props} />;
  }
}

// Note: An un-wrapped DonateWidget is also exported above.
export default connectDonateWidgetToStore(DonateWidget);
