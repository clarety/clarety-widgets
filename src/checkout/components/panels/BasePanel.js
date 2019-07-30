import React from 'react';
import { connect } from 'react-redux';
import { panelStatuses, nextPanel, editPanel } from 'checkout/actions';

export class BasePanel extends React.Component {
  onPressContinue = () => {
    this.props.nextPanel();
  }

  onPressEdit = () => {
    this.props.editPanel(this.props.index);
  };

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
}

const mapStateToProps = state => {
  return {

  };
};

const actions = {
  nextPanel: nextPanel,
  editPanel: editPanel,
};

export const connectPanel = connect(mapStateToProps, actions);
