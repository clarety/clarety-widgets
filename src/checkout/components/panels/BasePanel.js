import React from 'react';
import { panelStatuses } from 'checkout/actions';

export class BasePanel extends React.Component {
  onPressEdit = () => {
    const { index, editPanel } = this.props;
    editPanel(index);
  };

  updatePanelData(data) {
    const { index, updatePanelData } = this.props;
    updatePanelData(index, data);
  }

  render() {
    switch (this.props.status) {
      case panelStatuses.wait: return this.renderWait();
      case panelStatuses.edit: return this.renderEdit();
      case panelStatuses.done: return this.renderDone();

      default: throw new Error(`Unhandled panel status: ${status}`);
    }
  }

  renderWait() {
    throw new Error('renderWait not implemented');
  }

  renderEdit() {
    throw new Error('renderEdit not implemented');
  }

  renderDone() {
    throw new Error('renderDone not implemented');
  }

  hasError(field) {
    return !!this.props.errors.find(error => error.field === field);
  }
}
