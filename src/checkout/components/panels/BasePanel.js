import React from 'react';
import { panelStatuses } from 'checkout/actions';

export class BasePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      errors: [],
      onChange: this.onChangeField,
    };
  }

  onPressEdit = () => {
    const { index, editPanel } = this.props;
    editPanel(index);
  };

  onChangeField = (field, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
    }));
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
