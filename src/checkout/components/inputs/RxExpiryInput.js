import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { formatExpiry, cleanExpiry } from 'form/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';
import { updateFormData } from 'checkout/actions';
import './ExpiryInput.css';

class _RxExpiryInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expiryMonth: props.expiryMonth,
      expiryYear: props.expiryYear,
    };
  }

  onChange = event => {
    const { month, year } = cleanExpiry(event.target.value);

    this.setState({
      expiryMonth: month,
      expiryYear: year,
    });
  };

  onKeyDown = event => {
    const { value } = event.target;

    // Backspace.
    if (event.which === 8) {
      // Remove both the ' / ' and the preceding digit.
      if (value.length === 5) {
        event.preventDefault();
        const newValue = value[0] === '0' ? '' : value.substring(0, 1);
        event.target.value = newValue;
      }

      const position = event.target.selectionStart;
      if (position !== value.length) {
        event.preventDefault();
        event.target.value = '';
      }
    }

    // Space or slash.
    if (event.which === 32 || event.which === 191) {
      // Add the ' / '.
      if (value === '1') {
        event.preventDefault();
        event.target.value = '01 / ';
      }
    }

    // Enter
    if (event.key === 'Enter') this.updateFormData();
  };

  updateFormData = () => {
    const { monthField, yearField, updateFormData } = this.props;
    updateFormData({
      [monthField]: this.state.expiryMonth,
      [yearField]: this.state.expiryYear,
    });
  };
  
  render() {
    const { field, error } = this.props;
    const { expiryMonth, expiryYear } = this.state;

    return (
      <Form.Group controlId={field}>
        <Form.Control
          value={formatExpiry(expiryMonth, expiryYear)}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onBlur={this.updateFormData}
          placeholder={'MM / YY'}
          isInvalid={!!error}
          className="expiry-input"
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    expiryMonth: state.formData[ownProps.monthField] || '',
    expiryYear: state.formData[ownProps.yearField] || '',
    error: getValidationError(ownProps.field, state.errors),
  };
};

const actions = {
  updateFormData: updateFormData,
};

export const RxExpiryInput = connect(mapStateToProps, actions)(_RxExpiryInput);
