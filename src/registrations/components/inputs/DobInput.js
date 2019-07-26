import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FormContext, currentYear, iterate } from 'registrations/utils';

class _PureDobInput extends React.PureComponent {
  render() {
    return (
      <Form.Group controlId="dateOfBirth">
        <Form.Label>
          <FormattedMessage id="label.dateOfBirth" />
        </Form.Label>

        <Form.Row>
          <Col>{this.renderDayInput()}</Col>
          <Col>{this.renderMonthInput()}</Col>
          <Col>{this.renderYearInput()}</Col>
        </Form.Row>
      </Form.Group>
    );
  }

  renderDayInput() {
    const { day, dayField, onChange, intl, required } = this.props;

    const onChangeDay = event => onChange(dayField, event.target.value);

    return (
      <Form.Control as="select" value={day} onChange={onChangeDay} required={required}>
        <option value="" disabled selected hidden>
          {intl.formatMessage({ id: 'date.day' })}
        </option>

        {iterate(1, 31, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }

  renderMonthInput() {
    const { month, monthField, onChange, intl, required } = this.props;

    const onChangeMonth = event => onChange(monthField, event.target.value);

    return (
      <Form.Control as="select" value={month} onChange={onChangeMonth} required={required}>
        <option value="" disabled selected hidden>
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
    const { year, yearField, onChange, intl, required } = this.props;

    const onChangeYear = event => onChange(yearField, event.target.value);

    return (
      <Form.Control as="select" value={year} onChange={onChangeYear} required={required}>
        <option value="" disabled selected hidden>
          {intl.formatMessage({ id: 'date.year' })}
        </option>

        {iterate(currentYear, 1900, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }
}

const PureDobInput = injectIntl(_PureDobInput);

export class DobInput extends React.Component {
  render() {
    const { formData, onChange } = this.context;
    const { dayField, monthField, yearField } = this.props;

    return (
      <PureDobInput
        {...this.props}
        day={formData[dayField] || ''}
        month={formData[monthField] || ''}
        year={formData[yearField] || ''}
        onChange={onChange}
      />
    );
  }
}

DobInput.contextType = FormContext;
