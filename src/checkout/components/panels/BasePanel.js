import React from 'react';
import { validateRequired, validateEmail, validatePassword, validateCardNumber, validateCardExpiry, validateCcv, validateDob } from 'shared/utils/validation-utils';

export class BasePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      errors: [],
      onChange: this.onChangeField,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.status === 'wait' && this.props.status === 'edit') {
      this.onShowPanel();
    }
  }

  onShowPanel() {
    // Override in subclass.
  }

  onPressEdit = () => {
    this.props.editPanel();
  };

  onChangeField = (field, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
      errors: prevState.errors.filter(error => error.field !== field),
    }));
  };

  reset() {
    this.setState({
      formData: {},
    });
  }

  render() {
    switch (this.props.status) {
      case 'wait': return this.renderWait();
      case 'edit': return this.renderEdit();
      case 'done': return this.renderDone();

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
    const value = this.state.formData[field];
    validateRequired(value, field, errors);
  }

  validateEmail(field, errors) {
    const value = this.state.formData[field];
    validateEmail(value, field, errors);
  }

  validatePassword(field, errors) {
    const value = this.state.formData[field];
    validatePassword(value, field, errors);
  }

  validateCardNumber(field, errors) {
    const value = this.state.formData[field];
    validateCardNumber(value, field, errors);
  }

  validateCardExpiry(field, monthField, yearField, errors) {
    const monthValue = this.state.formData[monthField];
    const yearValue = this.state.formData[yearField];
    validateCardExpiry(monthValue, yearValue, field, errors);
  }

  validateCcv(field, errors) {
    const value = this.state.formData[field];
    validateCcv(value, field, errors);
  }

  validateDob({ field, dayField, monthField, yearField, comparisonDate, minAge, maxAge, errors }) {
    const day   = this.state.formData[dayField];
    const month = this.state.formData[monthField];
    const year  = this.state.formData[yearField];
    validateDob({ field, day, month, year, comparisonDate, minAge, maxAge, errors });
  }
}
