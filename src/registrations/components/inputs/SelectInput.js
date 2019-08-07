import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { FormContext } from 'registrations/utils';
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
    const { field, options, required, error } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          <FormattedMessage id={`label.${field}`} />
        </Form.Label>
        <Select
          value={this.state.value}
          onChange={this.onChange}
          options={options}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          classNamePrefix="react-select"
        />
        {/* Gross hack to add html5 'required' functionality */}
        {/* See: https://github.com/JedWatson/react-select/issues/3140 */}
        <input
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', width: 0, height: 0, left: '50%', opacity: 0 }}
          value={this.state.value}
          onChange={() => {}}
          required={required}
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
