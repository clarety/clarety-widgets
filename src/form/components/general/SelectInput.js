import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { findElement } from '../../../shared/utils/element-utils';
import { updateFormData } from '../../actions';
import { getValidationError } from '../../utils/form-utils';
import FieldError from '../errors/FieldError';

const SelectInput = ({ value, options, placeholder, testId, error, onChange }) => (
  <>
    <Form.Control
      as="select"
      value={value}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    >
      <option>{placeholder}</option>
      {Object.keys(options).map(value =>
        <option key={value} value={value}>{options[value]}</option>
      )}
    </Form.Control>
    <FieldError error={error} />
  </>
);

const mapStateToProps = (state, { property }) => {
  const element = findElement(property, state.explain.elements);
  if (!element.options) throw new Error(`[Clarety] SelectInput could not find options for property '${property}'.`);

  return {
    options: element.options,
    value: state.formData[property] || '',
    error: getValidationError(property, state.errors),
  }
};

const mapDispatchToProps = (dispatch, { property }) => {
  return {
    onChange: event => dispatch(updateFormData(property, event.target.value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectInput);
