import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormContext } from 'registrations/utils';

class PureTextInput extends React.PureComponent {
  render() {
    const { field, type, value, onChange, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          <FormattedMessage id={`label.${field}`} />
        </Form.Label>
        <Form.Control
          value={value}
          onChange={event => onChange(field, event.target.value)}
          type={type}
          required={required}
        />
      </Form.Group>
    );
  }
}

export class TextInput extends React.Component {
  render() {
    const { formData, onChange } = this.context;

    return (
      <PureTextInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
      />
    );
  }
}

TextInput.contextType = FormContext;
