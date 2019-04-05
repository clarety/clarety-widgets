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

const mapStateToProps = (state, { property }) => {
  return {
    value: state.formData[property] || '',
    error: getValidationError(property, state.errors),
  };
};

const mapDispatchToProps = (dispatch, { property }) => {
  return {
    onChange: event => dispatch(updateFormData(property, event.target.value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TextInput);
