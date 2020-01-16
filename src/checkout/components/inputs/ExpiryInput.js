import React from 'react';
import { Form } from 'react-bootstrap';
import { FormContext } from 'shared/utils';
import { getValidationError, formatExpiry, cleanExpiry } from 'form/utils';
import { FieldError } from 'form/components';
import './ExpiryInput.css';

class PureExpiryInput extends React.PureComponent {
  onChange = event => {
    const { monthField, yearField, onChange } = this.props;
    const { month, year } = cleanExpiry(event.target.value);
    onChange(monthField, month);
    onChange(yearField, year);
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
  };
  
  render() {
    let { field, label, expiryMonth, expiryYear, error, required, hideLabel } = this.props;
    if (!required && hideLabel) label += ' (Optional)';

    return (
      <Form.Group controlId={field}>
        <Form.Label srOnly={hideLabel}>
          {label}
          {!required && <span className="optional"> (Optional)</span>}
        </Form.Label>

        <Form.Control
          value={formatExpiry(expiryMonth, expiryYear)}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder={hideLabel ? label : 'MM / YY'}
          required={required}
          isInvalid={!!error}
          className="expiry-input"
        />
        
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class ExpiryInput extends React.Component {
  render() {
    const { field, monthField, yearField } = this.props;
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(field, errors);

    return (
      <PureExpiryInput
        {...this.props}
        expiryMonth={formData[monthField] || ''}
        expiryYear={formData[yearField] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

ExpiryInput.contextType = FormContext;
