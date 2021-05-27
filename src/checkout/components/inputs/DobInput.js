import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext, currentYear, iterate } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureDobInput extends React.PureComponent {
  render() {
    let { label, required, hideLabel, error, dayError, monthError, yearError } = this.props;

    return (
      <Form.Group>
        <Form.Label srOnly={hideLabel}>
          {label}
          {!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
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
    const { day, dayField, onChange, error, dayError } = this.props;

    const onChangeDay = event => onChange(dayField, event.target.value);

    return (
      <Form.Control as="select" value={day} onChange={onChangeDay} isInvalid={!!(error || dayError)}>
        <option value="" disabled hidden>{t('day', 'Day')}</option>

        {iterate(1, 31, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }

  renderMonthInput() {
    const { month, monthField, onChange, error, monthError } = this.props;

    const onChangeMonth = event => onChange(monthField, event.target.value);

    return (
      <Form.Control as="select" value={month} onChange={onChangeMonth} isInvalid={!!(error || monthError)}>
        <option value="" disabled hidden>{t('month', 'Month')}</option>
        <option value="1">{t('month-1', 'January')}</option>
        <option value="2">{t('month-2', 'February')}</option>
        <option value="3">{t('month-3', 'March')}</option>
        <option value="4">{t('month-4', 'April')}</option>
        <option value="5">{t('month-5', 'May')}</option>
        <option value="6">{t('month-6', 'June')}</option>
        <option value="7">{t('month-7', 'July')}</option>
        <option value="8">{t('month-8', 'August')}</option>
        <option value="9">{t('month-9', 'September')}</option>
        <option value="10">{t('month-10', 'October')}</option>
        <option value="11">{t('month-11', 'November')}</option>
        <option value="12">{t('month-12', 'December')}</option>
      </Form.Control>
    );
  }

  renderYearInput() {
    const { year, yearField, onChange, maxYear, error, yearError } = this.props;

    const startYear = maxYear || currentYear;
    const endYear = 1900;

    const onChangeYear = event => onChange(yearField, event.target.value);

    return (
      <Form.Control as="select" value={year} onChange={onChangeYear} isInvalid={!!(error || yearError)}>
        <option value="" disabled hidden>{t('year', 'Year')}</option>

        {iterate(startYear, endYear, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }
}

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
