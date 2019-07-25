import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormContext } from 'registrations/utils';

class PurePhoneInput extends React.PureComponent {
  render() {
    const { field, value, onChange } = this.props;

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          <FormattedMessage id={`label.${field}`} />
        </Form.Label>
        <Form.Control
          value={value}
          onChange={event => onChange(field, event.target.value)}
          type="tel"
        />
      </Form.Group>
    );
  }
}

export class PhoneInput extends React.Component {
  render() {
    const { formData, onChange } = this.context;

    return (
      <PurePhoneInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
      />
    );
  }
}

PhoneInput.contextType = FormContext;
