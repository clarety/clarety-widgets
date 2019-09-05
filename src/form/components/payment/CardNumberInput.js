import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError, getCardType, formatCardNumber, cleanCardNumber } from 'form/utils';
import { FieldError } from 'form/components';
import './CardNumberInput.css';

const _CardNumberInput = ({ value, placeholder, testId, onChange, error }) => (
  <React.Fragment>
    <Form.Control
      type="text"
      className={'card-number ' + getCardType(value)}
      placeholder={placeholder || '•••• •••• •••• ••••'}
      value={value}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </React.Fragment>
);

const mapStateToProps = (state, ownProps) => {
  const { formData, errors } = state;
  const { field } = ownProps;

  return {
    value: formatCardNumber(formData[field] || ''),
    error: getValidationError(field, errors),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: event => {
      const value = cleanCardNumber(event.target.value);
      dispatch(updateFormData(ownProps.field, value));
    },
  };
};

export const CardNumberInput = connect(mapStateToProps, mapDispatchToProps)(_CardNumberInput);
