import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

const _TextInput = ({ value, type, placeholder, testId, error, onChange }) => (
  <React.Fragment>
    <Form.Control
      type={type || 'text'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    />
    <FieldError error={error} />
  </React.Fragment>
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

export const TextInput = connect(mapStateToProps, mapDispatchToProps)(_TextInput);