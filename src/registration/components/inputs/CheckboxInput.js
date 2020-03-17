import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureCheckboxInput extends React.PureComponent {
  render() {
    const { field, checked, disabled, onChange, label, translationId, error, required } = this.props;

    return (
      <Form.Group controlId={field}>
        <FormCheck>
          <FormCheck.Input
            checked={checked}
            disabled={disabled}
            onChange={event => onChange(field, event.target.checked)}
            isInvalid={!!error}
          />

          <FormCheck.Label>
            {label || <FormattedMessage id={translationId || `label.${field}`} />}
            {!required && <span className="optional"> (Optional)</span>}
          </FormCheck.Label>

          <FormattedHTMLMessage id={`explanation.${field}`} defaultMessage=" ">
            {text => text !== ' ' && <p className="explanation-text" dangerouslySetInnerHTML={{ __html: text }} />}
          </FormattedHTMLMessage>
        </FormCheck>
        <FieldError error={error} />
      </Form.Group>
    );
  }
}

export class CheckboxInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureCheckboxInput
        {...this.props}
        checked={formData[this.props.field] || false}
        onChange={onChange}
        error={error}
      />
    );
  }
}

CheckboxInput.contextType = FormContext;
