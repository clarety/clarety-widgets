import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { findElement } from '../../shared/utils/element-utils';
import { updateFormData } from '../actions';
import { getValidationError } from '../utils/form-utils';
import FieldError from './FieldError';

const SelectInput = ({ property, placeholder, testId, formData, elements, errors, updateFormData }) => {
  const error = getValidationError(property, errors);

  const { options } = findElement(property, elements);
  const values = Object.keys(options);

  const onChange = event => {
    updateFormData(property, event.target.value);
  };

  return (
    <>
      <Form.Control as="select"
        value={formData[property] || ''}
        onChange={onChange}
        data-testid={testId}
        isInvalid={error !== null}
      >
        <option>{placeholder}</option>
        {values.map(value =>
          <option key={value} value={value}>{options[value]}</option>
        )}
      </Form.Control>
      <FieldError error={error} />
    </>
  );
};

const mapStateToProps = state => {
  return {
    elements: state.elements,
    formData: state.formData,
    errors: state.errors,
  }
};

const actions = {
  updateFormData: updateFormData,
};

export default connect(mapStateToProps, actions)(SelectInput);
