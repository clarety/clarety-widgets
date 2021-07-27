import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { t } from 'shared/translations';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureSelectInput extends React.PureComponent {
  constructor(props) {
    super(props);

    const { value, options } = props;

    const initialValue = value && options.find(
      option => option.value === value
    );

    this.state = {
      value: initialValue || '',
    };
  }

  onChange = option => {
    this.setState({ value: option });
    this.props.onChange(this.props.field, option.value);
  };

  render () {
    const { field, label, options, error, required } = this.props;

    const className = error ? 'react-select-invalid' : undefined;

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          {label}{!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>
        <Select
          value={this.state.value}
          onChange={this.onChange}
          options={options}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          className={className}
          classNamePrefix="react-select"
        />
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class SelectInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureSelectInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

SelectInput.contextType = FormContext;
