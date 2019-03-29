import React from 'react';
import { connectDonateWidgetToStore } from '../utils/donate-utils.js';
import mockInitData from '../mock-data/init.json';
import ClaretyApi from '../../shared/services/clarety-api';
import AmountPanel from './AmountPanel';
import DetailsPanel from './DetailsPanel';
import PaymentPanel from './PaymentPanel';
import SuccessPanel from './SuccessPanel';


import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock
  .onGet('http://dev-clarety-baseline.clarety.io/api/explain/?endpoint=donate')
  .reply(200, mockInitData);


export class DonateWidget extends React.Component {
  async componentWillMount() {
    const { setElements, setSuggestedDonations } = this.props;

    const explain = await ClaretyApi.explain('donate');
    setElements(explain.elements);
    setSuggestedDonations(explain.suggestedDonations);
  }

  render() {
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
