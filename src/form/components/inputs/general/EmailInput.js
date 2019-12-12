import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

const _EmailInput = ({ value, placeholder, error, onChange, hideErrors }) => (
  <React.Fragment>
    <Form.Control
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      isInvalid={error !== null}
    />
    {!hideErrors && <FieldError error={error} />}
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
    onChange: event => dispatch(updateFormData(field, event.target.value.trim())),
  };
};

export const EmailInput = connect(mapStateToProps, mapDispatchToProps)(_EmailInput);
