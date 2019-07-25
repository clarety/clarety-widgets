import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormContext } from 'registrations/utils';

class PureCheckboxInput extends React.PureComponent {
  render() {
    const { field, checked, onChange } = this.props;

    return (
      <Form.Group controlId={field}>
        <FormCheck>
          <FormCheck.Input
            checked={checked}
            onChange={event => onChange(field, event.target.checked)}
          />
          <FormCheck.Label>
            <FormattedMessage id={`label.${field}`} />
          </FormCheck.Label>
        </FormCheck>
      </Form.Group>
    );
  }
}

export class CheckboxInput extends React.Component {
  render() {
    const { formData, onChange } = this.context;

    return (
      <PureCheckboxInput
        {...this.props}
        checked={formData[this.props.field] || false}
        onChange={onChange}
      />
    );
  }
}

CheckboxInput.contextType = FormContext;
