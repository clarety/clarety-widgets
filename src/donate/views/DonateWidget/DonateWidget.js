import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import ClaretyApi from '../../../shared/services/clarety-api';
import { statuses } from '../../../shared/actions';
import { connectDonateWidgetToStore } from '../../utils/donate-utils.js';
import AmountPanel from './AmountPanel';
import DetailsPanel from './DetailsPanel';
import PaymentPanel from './PaymentPanel';
import SuccessPanel from './SuccessPanel';


import { setupAxiosMock } from '../../mock-data/axios-mock';
setupAxiosMock();


export class DonateWidget extends React.Component {
  async componentWillMount() {
    const { setCurrency, setElements, setStatus } = this.props;
    const { setDonationOffers, selectDefaults } = this.props;

    const explain = await ClaretyApi.explain('donate');
    setCurrency(explain.currency);
    setElements(explain.elements);
    setDonationOffers(explain.donationOffers);
    selectDefaults(explain.donationOffers);
    setStatus(statuses.ready);
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
