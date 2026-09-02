import React from 'react';
import { connect } from 'react-redux';
import { Form, FormCheck } from 'react-bootstrap';
import { t } from 'shared/translations';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

class _RadioInput extends React.Component {
  constructor(props) {
    super(props);

    if (!props.value && props.initialValue !== undefined) {
      props.setInitialValue(props.initialValue);
    }
  }

  render() {
    const { field, value, options, onChange, error, formGroupClassName } = this.props;

    return (
      <Form.Group className={formGroupClassName}>
        {options.map(option =>
          <FormCheck key={option.value} id={`${field}.${option.value}`} type="radio">
            <FormCheck.Input
              type="radio"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />

            {this.renderLabel(option)}
          </FormCheck>
        )}

        <FieldError error={error} />
      </Form.Group>
    );
  }

  renderLabel(option) {
    if (this.props.renderLabel) {
      return this.props.renderLabel(option);
    } else {
      const { getTranslationKey } = this.props;
      const translationKey = getTranslationKey ? getTranslationKey(option.value, option.label) : option.label;
      return (
        <FormCheck.Label>
          {t(translationKey, option.label)}
        </FormCheck.Label>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.formData[ownProps.field],
    error: getValidationError(ownProps.field, state.errors),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => dispatch(updateFormData(ownProps.field, value)),
    setInitialValue: value => dispatch(updateFormData(ownProps.field, value)),
  };
};

export const RadioInput = connect(mapStateToProps, mapDispatchToProps)(_RadioInput);
