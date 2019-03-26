import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateData } from '../actions';
import { getValidationError } from '../utils/form-utils';

const TextInput = ({ property, type, placeholder, testId, formData, errors, updateData }) => {
  let error = getValidationError(property, errors);

  return (
    <>
      <Form.Control
        type={type || 'text'}
        placeholder={placeholder}
        value={formData[property] || ''}
        onChange={event => updateData(property, event.target.value)}
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

const mapStateToProps = state => {
  return {
    formData: state.data,
    errors: state.errors,
  };
};

const actions = {
  updateData: updateData,
};

export default connect(mapStateToProps, actions)(TextInput);
