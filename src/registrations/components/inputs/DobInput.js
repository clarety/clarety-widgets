import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FormContext, currentYear, iterate } from 'registrations/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class _PureDobInput extends React.PureComponent {
  render() {
    const { error, dayError, monthError, yearError } = this.props;

    return (
      <Form.Group controlId="dateOfBirth">
        <Form.Label>
          <FormattedMessage id="label.dateOfBirth" />
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
    const { day, dayField, onChange, intl } = this.props;

    const onChangeDay = event => onChange(dayField, event.target.value);

    return (
      <Form.Control as="select" value={day} onChange={onChangeDay}>
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
    const { month, monthField, onChange, intl } = this.props;

    const onChangeMonth = event => onChange(monthField, event.target.value);

    return (
      <Form.Control as="select" value={month} onChange={onChangeMonth}>
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
    const { year, yearField, onChange, intl, maxYear } = this.props;

    const startYear = maxYear || currentYear;
    const endYear = 1900;

    const onChangeYear = event => onChange(yearField, event.target.value);

    return (
      <Form.Control as="select" value={year} onChange={onChangeYear}>
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
