import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { findElement } from '../../../shared/utils/element-utils';
import { updateFormData } from '../../actions';
import { getValidationError } from '../../utils/form-utils';
import FieldError from '../errors/FieldError';

const SelectInput = ({ value, options, placeholder, testId, error, onChange }) => (
  <React.Fragment>
    <Form.Control
      as="select"
      value={value}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    >
      <option>{placeholder}</option>
      {options.map(option =>
        <option key={option.value} value={option.value}>{option.label}</option>
      )}
    </Form.Control>
    <FieldError error={error} />
  </React.Fragment>
);

const mapStateToProps = (state, { field }) => {
  const element = findElement(field, state.explain.elements);
  if (!element.options) throw new Error(`[Clarety] SelectInput could not find options for field '${field}'.`);

  return {
    options: element.options,
    value: state.formData[field] || '',
    error: getValidationError(field, state.errors),
  }
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(updateFormData(field, event.target.value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectInput);
