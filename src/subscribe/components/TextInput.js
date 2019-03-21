import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from '../actions/formDataActions';

const TextInput = ({ property, type, placeholder, testId, formData, errors, updateFormData }) => {
  let error = getValidationError(property, errors);

  return (
    <>
      <Form.Control
        type={type || 'text'}
        placeholder={placeholder}
        value={formData[property] || ''}
        onChange={event => updateFormData(property, event.target.value)}
        data-testid={testId}
        isInvalid={error !== null}
      />
      {error && 
        <Form.Control.Feedback type="invalid">
          {error.message}
        </Form.Control.Feedback>
      }
    </>
    );
};

const getValidationError = (property, errors) => {
  for (let error of errors) {
    if (error.field === property) return error;
  }

  return null;
};

const mapStateToProps = state => {
  return {
    formData: state.formData,
    errors: state.validationErrors,
  };
};

const actions = {
  updateFormData: updateFormData,
};

export default connect(mapStateToProps, actions)(TextInput);
