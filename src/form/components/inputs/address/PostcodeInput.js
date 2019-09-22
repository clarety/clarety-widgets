import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

const _PostcodeInput = ({ value, placeholder, error, onChange }) => (
  <React.Fragment>
    <Form.Control
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      isInvalid={!!error}
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

const cleanPostcode = value => value.replace(/[^0-9]/g, '').substring(0, 4);

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(
      updateFormData(field, cleanPostcode(event.target.value))
    ),
  };
};

export const PostcodeInput = connect(mapStateToProps, mapDispatchToProps)(_PostcodeInput);
