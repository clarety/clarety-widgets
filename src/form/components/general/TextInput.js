import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from '../../actions';
import { getValidationError } from '../../utils/form-utils';
import FieldError from '../errors/FieldError';

const TextInput = ({ value, type, placeholder, testId, error, onChange }) => (
  <>
    <Form.Control
      type={type || 'text'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </>
);

const mapStateToProps = (state, { field }) => {
  return {
    value: state.formData[field] || '',
    error: getValidationError(field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(updateFormData(field, event.target.value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TextInput);
