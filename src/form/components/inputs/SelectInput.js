import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { findElement } from 'shared/utils';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

const _SelectInput = ({ value, options, placeholder, testId, error, onChange }) => (
  <React.Fragment>
    <Form.Control
      as="select"
      value={value}
      onChange={onChange}
      data-testid={testId}
      isInvalid={error !== null}
    >
      <option value="" disabled hidden>{placeholder}</option>
      
      {options.map(option =>
        <option key={option.value} value={option.value}>{option.label}</option>
      )}
    </Form.Control>
    <FieldError error={error} />
  </React.Fragment>
);

_SelectInput.defaultProps = {
  placeholder: 'Select',
};

const mapStateToProps = (state, ownProps) => {
  let { field, options } = ownProps;

  // If no options are provided, try to get them from the elements in our settings.
  if (!options) {
    const element = findElement(field, state.settings.elements);
    options = element ? element.options : options;
  }

  // If we still don't have options, something went wrong.
  if (!options) throw new Error(`[Clarety] SelectInput could not find options for field '${field}'.`);

  return {
    options: options,
    value: state.formData[field] || '',
    error: getValidationError(field, state.errors),
  }
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(updateFormData(field, event.target.value)),
  };
};

export const SelectInput = connect(mapStateToProps, mapDispatchToProps)(_SelectInput);
