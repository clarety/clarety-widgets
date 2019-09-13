import React from 'react';
import { connect } from 'react-redux';
import { Form, FormCheck } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

const _CheckboxInput = ({ value, field, label, error, onChange }) => (
  <Form.Group controlId={field}>
    <FormCheck>
      <FormCheck.Input
        checked={value}
        onChange={onChange}
      />
      <FormCheck.Label>{label}</FormCheck.Label>
    </FormCheck>
    <FieldError error={error} />
  </Form.Group>
);

const mapStateToProps = (state, { field }) => {
  return {
    value: state.formData[field] || false,
    error: getValidationError(field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(updateFormData(field, event.target.checked)),
  };
};

export const CheckboxInput = connect(mapStateToProps, mapDispatchToProps)(_CheckboxInput);
