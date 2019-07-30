import React from 'react';
import { BasePanel, connectPanel } from 'checkout/components';

class _PersonalDetailsPanel extends BasePanel {
  renderWait() {
    return (
      <h2 style={{ opacity: 0.3 }}>2. Personal Details</h2>
    );
  }

  renderEdit() {
    return (
      <div>
        <h2>2. Personal Details</h2>
        <p>Form fields go here...</p>
        <button onClick={this.onPressContinue}>Continue</button>
      </div>
    );
  }

  renderDone() {
    return (
      <div>
        <h2 style={{ opacity: 0.3 }}>2. Personal Details <button onClick={this.onPressEdit}>Edit</button></h2>
      </div>
    );
  }
}

export const PersonalDetailsPanel = connectPanel(_PersonalDetailsPanel);
