import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError, formatExpiry, cleanExpiry } from 'form/utils';
import { FieldError } from 'form/components';

class _ExpiryInput extends React.Component {
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
    const { value, testId, onChange, placeholder, error } = this.props;
    return (
      <React.Fragment>
        <Form.Control
          type="text"
          value={value}
          placeholder={placeholder || 'MM / YY'}
          onChange={onChange}
          onKeyDown={this.onKeyDown}
          type="tel"
          autocomplete="cc-exp"
          className="expiry-input"
          isInvalid={error !== null}
          data-testid={testId}
        />
        <FieldError error={error} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { field, monthField, yearField } = ownProps;
  const { formData, errors } = state;

  return {
    value: formatExpiry(formData[monthField], formData[yearField]),
    error: getValidationError(field, errors),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: event => {
      const { month, year } = cleanExpiry(event.target.value);
      dispatch(updateFormData(ownProps.monthField, month));
      dispatch(updateFormData(ownProps.yearField, year));
    },
  }
};

export const ExpiryInput = connect(mapStateToProps, mapDispatchToProps)(_ExpiryInput);
