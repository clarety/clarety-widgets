import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError, cleanCcv } from 'form/utils';
import { FieldError } from 'form/components';

const _CcvInput = ({ value, placeholder, testId, onChange, error }) => (
  <React.Fragment>
    <Form.Control
      type="text"
      placeholder={placeholder || '•••'}
      type="tel"
      value={value}
      onChange={onChange}
      data-testid={testId}
      maxLength={4}
      isInvalid={error !== null}
      className="ccv-input"
    />
    <FieldError error={error} />
  </React.Fragment>
);

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.formData[ownProps.field] || '',
    error: getValidationError(ownProps.field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: event => {
      const value = cleanCcv(event.target.value);
      dispatch(updateFormData(ownProps.field, value));
    },
  };
};

export const CcvInput = connect(mapStateToProps, mapDispatchToProps)(_CcvInput);
