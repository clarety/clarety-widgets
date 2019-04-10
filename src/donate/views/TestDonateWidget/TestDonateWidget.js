import React from 'react';
import { connectDonateWidgetToStore } from '../../utils/donate-utils.js';
import { DonateWidget } from '../DonateWidget/DonateWidget';

class TestDonateWidget extends DonateWidget {
  renderAmountPanel(props) {
    return <p data-testid="test-panel">Test Panel</p>
  }
}

export default connectDonateWidgetToStore(TestDonateWidget);
