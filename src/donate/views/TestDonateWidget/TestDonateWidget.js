import React from 'react';
import { connectDonateWidgetToStore } from '../../utils/donate-utils.js';
import { DonateWidget } from '../DonateWidget/DonateWidget';
import TestDetailsPanel from './TestDetailsPanel.js';

class TestDonateWidget extends DonateWidget {
  renderAmountPanel(props) {
    return <p data-testid="test-panel">Test Amount Panel</p>
  }

  renderDetailsPanel(props) {
    return <TestDetailsPanel {...props} />
  }
}

export default connectDonateWidgetToStore(TestDonateWidget);
