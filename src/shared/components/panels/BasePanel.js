import React from 'react';

export class BasePanel extends React.Component {
  reset() {
    // Override in subclass.
    // Called by panel manager.
  }

  componentDidMount() {
    if (this.props.status === 'edit') {
      this.onShowPanel();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status === 'wait' && this.props.status === 'edit') {
      this.onShowPanel();
    }
  }

  onPressEdit = () => {
    this.props.editPanel();
  };

  onShowPanel() {
    // Override in subclass.
  }

  render() {
    switch (this.props.status) {
      case 'wait': return this.renderWait();
      case 'edit': return this.renderEdit();
      case 'done': return this.renderDone();
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
