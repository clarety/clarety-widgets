import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { getNestedElement } from '../utils/element-utils';
import { updateFormData } from '../actions/formDataActions';

const SelectInput = ({ property, placeholder, formData, elements, errors, updateFormData }) => {
  const error = getValidationError(property, errors);
  const { options } = getNestedElement(property, elements);
  const values = Object.keys(options);

  return (
    <>
      <Form.Control as="select"
        value={formData[property] || ''}
        onChange={event => updateFormData(property, event.target.value)}
        isInvalid={error !== null}
      >
        <option>{placeholder}</option>
        {values.map(value =>
          <option key={value} value={value}>{options[value]}</option>
        )}
      </Form.Control>
      
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
    elements: state.elements,
    errors: state.validationErrors,
  }
};

const actions = {
  updateFormData: updateFormData,
};

export default connect(mapStateToProps, actions)(SelectInput);
