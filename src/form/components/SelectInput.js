import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { findElement } from '../../shared/utils/element-utils';
import { updateData } from '../actions/formDataActions';

const SelectInput = ({ property, placeholder, formData, elements, errors, updateData }) => {
  const error = getValidationError(property, errors);
  const { options } = findElement(property, elements);
  const values = Object.keys(options);

  return (
    <>
      <Form.Control as="select"
        value={formData[property] || ''}
        onChange={event => updateData(property, event.target.value)}
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
    elements: state.elements,
    formData: state.data,
    errors: state.errors,
  }
};

const actions = {
  updateData: updateData,
};

export default connect(mapStateToProps, actions)(SelectInput);
