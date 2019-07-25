import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import ReactPhoneNumberInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FormContext } from 'registrations/utils';

class PurePhoneInput extends React.PureComponent {
  render() {
    const { field, value, onChange } = this.props;
    const country = "IN"; // TODO: get from config...
    const length = 10; // TODO: get from config...
    const maxLength = length + 3; // Add 3 to allow for country code.

    return (
      <Form.Group controlId={field}>
        <Form.Label>
          <FormattedMessage id={`label.${field}`} />
        </Form.Label>
        <ReactPhoneNumberInput
          value={value}
          onChange={value => onChange(field, value)}
          limitMaxLength={true}
          // maxlength="12" // TODO: GET FROM CONFIG .....
          inputClassName="form-control"
          // countries={['IN']}
          // international={false}
          country={country}
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
