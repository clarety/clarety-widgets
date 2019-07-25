import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { FormContext } from 'registrations/utils';

class PureSelectInput extends React.PureComponent {
  constructor(props) {
    super(props);

    const { value, options } = props;

    const initialValue = options.find(
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
    const { field, options } = this.props;

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
      </Form.Group>
    );
  }
}

export class SelectInput extends React.Component {
  render() {
    const { formData, onChange } = this.context;

    return (
      <PureSelectInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
      />
    );
  }
}

SelectInput.contextType = FormContext;
