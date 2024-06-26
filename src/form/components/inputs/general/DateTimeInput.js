import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

const _DateTimeInput = ({ value, placeholder, testId, error, onChange, required }) => {
  if (placeholder && !required) placeholder += t('optional-label', ' (Optional)');

  return (
    <React.Fragment>
      <Form.Control
        type="datetime-local"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-testid={testId}
        isInvalid={error !== null}
      />
      <FieldError error={error} />
    </React.Fragment>
  );
};

const mapStateToProps = (state, { field }) => {
  return {
    value: state.formData[field] || '',
    error: getValidationError(field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(updateFormData(field, event.target.value)),
  };
};

export const DateTimeInput = connect(mapStateToProps, mapDispatchToProps)(_DateTimeInput);
