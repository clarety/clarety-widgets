import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

const _BsbInput = ({ value, placeholder, error, onChange, required }) => {
  if (placeholder && !required) placeholder += ' (Optional)';

  return (
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
};

const mapStateToProps = (state, { field }) => {
  return {
    value: state.formData[field] || '',
    error: getValidationError(field, state.errors),
  };
};

const cleanBsb = value => value.replace(/[^0-9]/g, '').substring(0, 6);

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(
      updateFormData(field, cleanBsb(event.target.value))
    ),
  };
};

export const BsbInput = connect(mapStateToProps, mapDispatchToProps)(_BsbInput);
