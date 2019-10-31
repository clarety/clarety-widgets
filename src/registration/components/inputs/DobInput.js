import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FormContext } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';
import { currentYear, iterate } from 'registration/utils';

class _PureDobInput extends React.PureComponent {
  render() {
    const { error, dayError, monthError, yearError, required } = this.props;

    return (
      <Form.Group controlId="dateOfBirth">
        <Form.Label>
          <FormattedMessage id="label.customer.dateOfBirth" />
          {required && ' *'}
        </Form.Label>

        <Form.Row>
          <Col>
            {this.renderDayInput()}
            <FieldError error={dayError} />
          </Col>
          <Col>
            {this.renderMonthInput()}
            <FieldError error={monthError} />
          </Col>
          <Col>
            {this.renderYearInput()}
            <FieldError error={yearError} />
          </Col>
        </Form.Row>

        <FieldError error={error} />
      </Form.Group>
    );
  }

  renderDayInput() {
    const { day, dayField, onChange, intl, dayError, error } = this.props;

    const onChangeDay = event => onChange(dayField, event.target.value);
    const isInvalid = !!dayError || !!error;

    return (
      <Form.Control as="select" value={day} onChange={onChangeDay} isInvalid={isInvalid}>
        <option value="" disabled hidden>
          {intl.formatMessage({ id: 'date.day' })}
        </option>

        {iterate(1, 31, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }

  renderMonthInput() {
    const { month, monthField, onChange, intl, monthError, error } = this.props;

    const onChangeMonth = event => onChange(monthField, event.target.value);
    const isInvalid = !!monthError || !!error;

    return (
      <Form.Control as="select" value={month} onChange={onChangeMonth} isInvalid={isInvalid}>
        <option value="" disabled hidden>
          {intl.formatMessage({ id: 'date.month' })}
        </option>
        
        {iterate(1, 12, value => 
          <option key={value} value={value}>
            {intl.formatMessage({ id: `date.month${value}` })}
          </option>
        )}
      </Form.Control>
    );
  }

  renderYearInput() {
    const { year, yearField, onChange, intl, maxYear, yearError, error } = this.props;

    const startYear = maxYear || currentYear;
    const endYear = 1900;

    const onChangeYear = event => onChange(yearField, event.target.value);
    const isInvalid = !!yearError || !!error;

    return (
      <Form.Control as="select" value={year} onChange={onChangeYear} isInvalid={isInvalid}>
        <option value="" disabled hidden>
          {intl.formatMessage({ id: 'date.year' })}
        </option>

        {iterate(startYear, endYear, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }
}

const PureDobInput = injectIntl(_PureDobInput);

export class DobInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const { field, dayField, monthField, yearField } = this.props;

    const error      = getValidationError(field, errors);
    const dayError   = getValidationError(dayField, errors);
    const monthError = getValidationError(monthField, errors);
    const yearError  = getValidationError(yearField, errors);

    return (
      <PureDobInput
        {...this.props}

        day={formData[dayField] || ''}
        month={formData[monthField] || ''}
        year={formData[yearField] || ''}

        onChange={onChange}

        error={error}
        dayError={dayError}
        monthError={monthError}
        yearError={yearError}
      />
    );
  }
}

DobInput.contextType = FormContext;
