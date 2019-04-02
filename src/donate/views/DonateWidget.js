import React from 'react';
import { connectDonateWidgetToStore } from '../utils/donate-utils.js';
import ClaretyApi from '../../shared/services/clarety-api';
import AmountPanel from './AmountPanel';
import DetailsPanel from './DetailsPanel';
import PaymentPanel from './PaymentPanel';
import SuccessPanel from './SuccessPanel';


import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mockInitData from '../mock-data/init.json';
import mockValidationOk from '../mock-data/validation-ok.json';
import mockValidationError from '../mock-data/validation-error.json';

const mock = new MockAdapter(axios);

mock
  .onGet('http://dev-clarety-baseline.clarety.io/api/explain/?endpoint=donate')
  .reply(200, mockInitData);

mock
  .onPost('http://dev-clarety-baseline.clarety.io/api/donate/choose-amount/')
  .reply(200, mockValidationError);


export class DonateWidget extends React.Component {
  // TEMP: use 'hasInitialized' flag until 'status' is added to store.
  state = {
    hasInitialized: false,
  };

  async componentWillMount() {
    const { setElements, setSuggestedDonations } = this.props;

    const explain = await ClaretyApi.explain('donate');
    setElements(explain.elements);
    setSuggestedDonations(explain.suggestedDonations);

    this.setState({ hasInitialized: true });
  }

  render() {
    if (!this.state.hasInitialized) return null;

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
