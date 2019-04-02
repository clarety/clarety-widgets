import React from 'react';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../../form/actions';
import { connectDonateWidgetToStore } from '../utils/donate-utils.js';
import AmountPanel from './AmountPanel';
import DetailsPanel from './DetailsPanel';
import PaymentPanel from './PaymentPanel';
import SuccessPanel from './SuccessPanel';


import { setupAxiosMock } from '../mock-data/axios-mock';
setupAxiosMock();


export class DonateWidget extends React.Component {
  async componentWillMount() {
    const { setElements, setSuggestedDonations, setStatus } = this.props;

    const explain = await ClaretyApi.explain('donate');
    setElements(explain.elements);
    setSuggestedDonations(explain.suggestedDonations);
    setStatus(statuses.ready);
  }

  render() {
    if (this.props.status === statuses.uninitialized) return null;

    return (
      <AmountPanel />
      // <DetailsPanel />
      // <PaymentPanel />
      // <SuccessPanel />
    );
  }
}

// Note: An un-wrapped DonateWidget is also exported above.
export default connectDonateWidgetToStore(DonateWidget);
