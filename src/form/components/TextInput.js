import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from '../actions';
import { getValidationError } from '../utils/form-utils';
import FieldError from './FieldError';

const TextInput = ({ property, type, placeholder, testId, formData, errors, updateFormData }) => {
  let error = getValidationError(property, errors);

  const onChange = event => {
    updateFormData(property, event.target.value);  
  };

  return (
    <>
      <Form.Control
        type={type || 'text'}
        placeholder={placeholder}
        value={formData[property] || ''}
        onChange={onChange}
        data-testid={testId}
        isInvalid={error !== null}
      />
      <FieldError error={error} />
    </>
    );
};

const mapStateToProps = state => {
  return {
    formData: state.formData,
    errors: state.errors,
  };
};

const actions = {
  updateFormData: updateFormData,
};

export default connect(mapStateToProps, actions)(TextInput);
