import React from 'react';
import { connect } from 'react-redux';
import { Form, FormCheck } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

class _CheckboxesInput extends React.Component {
  constructor(props) {
    super(props);

    if (!props.value && props.initialValue !== undefined) {
      props.setInitialValue(props.initialValue);
    }
  }

  onChecked(option, isChecked) {
    const { value, onChange } = this.props;

    if (isChecked) {
      onChange([...value, option.value]);
    } else {
      onChange(value.filter(v => v !== option.value));
    }
  }

  render() {
    const { field, value, options, error } = this.props;

    return (
      <Form.Group>
        {options.map(option =>
          <FormCheck key={option.value} id={`${field}.${option.value}`}>
            <FormCheck.Input
              checked={value.includes(option.value)}
              onChange={event => this.onChecked(option, event.target.checked)}
            />
            <FormCheck.Label>{option.label}</FormCheck.Label>
          </FormCheck>
        )}

        <FieldError error={error} />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.formData[ownProps.field] || [],
    error: getValidationError(ownProps.field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => dispatch(updateFormData(ownProps.field, value)),
    setInitialValue: value => dispatch(updateFormData(ownProps.field, value)),
  };
};

export const CheckboxesInput = connect(mapStateToProps, mapDispatchToProps)(_CheckboxesInput);
