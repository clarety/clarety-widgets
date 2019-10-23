import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { FormContext } from 'shared/utils';
import { currentYear, iterate } from 'registration/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

class PureDobInput extends React.PureComponent {
  render() {
    const { error, dayError, monthError, yearError } = this.props;

    return (
      <Form.Group controlId="dateOfBirth">
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
    const { day, dayField, onChange, required, dayError } = this.props;

    const onChangeDay = event => onChange(dayField, event.target.value);

    return (
      <Form.Control as="select" value={day} onChange={onChangeDay} required={required} isInvalid={!!dayError}>
        <option value="" disabled hidden>Day</option>

        {iterate(1, 31, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }

  renderMonthInput() {
    const { month, monthField, onChange, required, monthError } = this.props;

    const onChangeMonth = event => onChange(monthField, event.target.value);

    return (
      <Form.Control as="select" value={month} onChange={onChangeMonth} required={required} isInvalid={!!monthError}>
        <option value="" disabled hidden>Month</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </Form.Control>
    );
  }

  renderYearInput() {
    const { year, yearField, onChange, required, maxYear, yearError } = this.props;

    const startYear = maxYear || currentYear;
    const endYear = 1900;

    const onChangeYear = event => onChange(yearField, event.target.value);

    return (
      <Form.Control as="select" value={year} onChange={onChangeYear} required={required} isInvalid={!!yearError}>
        <option value="" disabled hidden>Year</option>

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
