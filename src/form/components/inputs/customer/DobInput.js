import React from 'react';
import { connect } from 'react-redux';  
import { Form, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { getFormData, getErrors } from 'shared/selectors';
import { currentYear, iterate } from 'shared/utils';
import { Label, FieldError } from 'form/components';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';

class _DobInput extends React.Component {
  render() {
    const { label, error, dayError, monthError, yearError, required } = this.props;

    return (
      <Form.Group>
        <Label required={required}>
          {label || t('date-of-birth', 'Date of Birth')}
        </Label>

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
          {t('day', 'Day')}
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
          {t('month', 'Month')}
        </option>
        
        <option value="1">{t('month1', 'January')}</option>
        <option value="2">{t('month2', 'February')}</option>
        <option value="3">{t('month3', 'March')}</option>
        <option value="4">{t('month4', 'April')}</option>
        <option value="5">{t('month5', 'May')}</option>
        <option value="6">{t('month6', 'June')}</option>
        <option value="7">{t('month7', 'July')}</option>
        <option value="8">{t('month8', 'August')}</option>
        <option value="9">{t('month9', 'September')}</option>
        <option value="10">{t('month10', 'October')}</option>
        <option value="11">{t('month11', 'November')}</option>
        <option value="12">{t('month12', 'December')}</option>
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
          {t('year', 'Year')}
        </option>

        {iterate(startYear, endYear, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const formData = getFormData(state);
  const errors = getErrors(state);

  return {
    day:   formData[ownProps.dayField]   || '',
    month: formData[ownProps.monthField] || '',
    year:  formData[ownProps.yearField]  || '',

    error:      getValidationError(ownProps.field, errors),
    dayError:   getValidationError(ownProps.dayField, errors),
    monthError: getValidationError(ownProps.monthField, errors),
    yearError:  getValidationError(ownProps.yearField, errors),
  };  
};

const actions = { onChange: updateFormData };

export const DobInput = connect(mapStateToProps, actions)(_DobInput);

DobInput.defaultProps = {
  dayField:   'customer.dateOfBirthDay',
  monthField: 'customer.dateOfBirthMonth',
  yearField:  'customer.dateOfBirthYear',
};
