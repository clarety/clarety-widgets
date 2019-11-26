import React from 'react';
import { connect } from 'react-redux';
import { Form, FormCheck } from 'react-bootstrap';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

class _CheckboxInput extends React.Component {
  constructor(props) {
    super(props);

    if (props.initialValue !== undefined) {
      props.setInitialValue(props.initialValue);
    }
  }

  render() {
    const { value, field, label, error, onChange } = this.props;

    return (
      <Form.Group controlId={field}>
        <FormCheck>
          <FormCheck.Input
            checked={value}
            onChange={onChange}
          />
          <FormCheck.Label>{label}</FormCheck.Label>
        </FormCheck>
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state, { field }) => {
  return {
    value: state.formData[field] || false,
    error: getValidationError(field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, { field }) => {
  return {
    onChange: event => dispatch(updateFormData(field, event.target.checked)),
    setInitialValue: value => dispatch(updateFormData(field, value)),
  };
};

export const CheckboxInput = connect(mapStateToProps, mapDispatchToProps)(_CheckboxInput);
