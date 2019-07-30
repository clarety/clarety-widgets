import React from 'react';
import { BasePanel, connectPanel } from 'checkout/components';

class _ShippingOptionsPanel extends BasePanel {
  renderWait() {
    return (
      <h2 style={{ opacity: 0.3 }}>4. Shipping Options</h2>
    );
  }

  renderEdit() {
    return (
      <div>
        <h2>4. Shipping Options</h2>
        <p>Form fields go here...</p>
        <button onClick={this.onPressContinue}>Continue</button>
      </div>
    );
  }

  renderDone() {
    return (
      <div>
        <h2 style={{ opacity: 0.3 }}>4. Shipping Options <button onClick={this.onPressEdit}>Edit</button></h2>
      </div>
    );
  }
}

export const ShippingOptionsPanel = connectPanel(_ShippingOptionsPanel);
