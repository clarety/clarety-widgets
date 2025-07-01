import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

class _TextInput extends React.Component {
  constructor(props) {
    super(props);

    if (!props.value && props.initialValue !== undefined) {
      props.setInitialValue(props.initialValue);
    }
  }

  render() {
    const { value, type, placeholder, testId, error, onChange, initialValue, setInitialValue, required, hideErrors, cleanFn, ...props } = this.props;
  
    return (
      <React.Fragment>
        <Form.Control
          type={type || 'text'}
          placeholder={this.renderPlaceholder()}
          value={value}
          onChange={onChange}
          data-testid={testId}
          isInvalid={!!error}
          {...props}
        />
        {!hideErrors && <FieldError error={error} />}
      </React.Fragment>
    );
  }

  renderPlaceholder() {
    const { placeholder, required } = this.props;

    // Append 'optional' if not required.
    if (placeholder && !required) {
      return placeholder + t('optional-label', ' (Optional)');
    }

    return placeholder;
  }
}

const mapStateToProps = (state, { field, displayFn }) => {
  if (!displayFn) displayFn = val => val;

  return {
    value: displayFn(state.formData[field] || ''),
    error: getValidationError(field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, { field, cleanFn }) => {
  if (!cleanFn) cleanFn = val => val;

  return {
    onChange: event => dispatch(updateFormData(field, cleanFn(event.target.value))),
    setInitialValue: value => dispatch(updateFormData(field, value)),
  };
};

export const TextInput = connect(mapStateToProps, mapDispatchToProps)(_TextInput);
