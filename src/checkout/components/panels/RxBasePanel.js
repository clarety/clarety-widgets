import React from 'react';
import { panelStatuses } from 'checkout/actions';
import { validateRequired, validateEmail, validatePassword, validateCardNumber, validateCardExpiry, validateCcv } from 'checkout/utils';

export class RxBasePanel extends React.Component {
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

  validateRequired(field, errors) {
    const value = this.props.formData[field];
    validateRequired(value, field, errors);
  }

  validateEmail(field, errors) {
    const value = this.props.formData[field];
    validateEmail(value, field, errors);
  }

  validatePassword(field, errors) {
    const value = this.props.formData[field];
    validatePassword(value, field, errors);
  }

  validateCardNumber(field, errors) {
    const value = this.props.formData[field];
    validateCardNumber(value, field, errors);
  }

  validateCardExpiry(field, monthField, yearField, errors) {
    const monthValue = this.props.formData[monthField];
    const yearValue = this.props.formData[yearField];
    validateCardExpiry(monthValue, yearValue, field, errors);
  }

  validateCcv(field, errors) {
    const value = this.props.formData[field];
    validateCcv(value, field, errors);
  }
}
