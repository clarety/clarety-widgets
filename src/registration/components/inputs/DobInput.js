import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { FormContext, currentYear, iterate } from 'shared/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureDobInput extends React.PureComponent {
  render() {
    const { label, error, dayError, monthError, yearError, required } = this.props;

    return (
      <Form.Group>
        <Form.Label>
          {label || 'Date of Birth'}{!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
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
    const { day, dayField, onChange, dayError, error } = this.props;

    const onChangeDay = event => onChange(dayField, event.target.value);
    const isInvalid = !!dayError || !!error;

    return (
      <Form.Control as="select" value={day} onChange={onChangeDay} isInvalid={isInvalid}>
        <option value="" disabled hidden>
          {t('date.day', 'Day')}
        </option>

        {iterate(1, 31, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }

  renderMonthInput() {
    const { month, monthField, onChange, monthError, error } = this.props;

    const onChangeMonth = event => onChange(monthField, event.target.value);
    const isInvalid = !!monthError || !!error;

    return (
      <Form.Control as="select" value={month} onChange={onChangeMonth} isInvalid={isInvalid}>
        <option value="" disabled hidden>
          {t('date.month', 'Month')}
        </option>
        
        <option value="1">{t('date.month1', 'January')}</option>
        <option value="2">{t('date.month2', 'February')}</option>
        <option value="3">{t('date.month3', 'March')}</option>
        <option value="4">{t('date.month4', 'April')}</option>
        <option value="5">{t('date.month5', 'May')}</option>
        <option value="6">{t('date.month6', 'June')}</option>
        <option value="7">{t('date.month7', 'July')}</option>
        <option value="8">{t('date.month8', 'August')}</option>
        <option value="9">{t('date.month9', 'September')}</option>
        <option value="10">{t('date.month10', 'October')}</option>
        <option value="11">{t('date.month11', 'November')}</option>
        <option value="12">{t('date.month12', 'December')}</option>
      </Form.Control>
    );
  }

  renderYearInput() {
    const { year, yearField, onChange, maxYear, yearError, error } = this.props;

    const startYear = maxYear || currentYear;
    const endYear = 1900;

    const onChangeYear = event => onChange(yearField, event.target.value);
    const isInvalid = !!yearError || !!error;

    return (
      <Form.Control as="select" value={year} onChange={onChangeYear} isInvalid={isInvalid}>
        <option value="" disabled hidden>
          {t('date.year', 'Year')}
        </option>

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
