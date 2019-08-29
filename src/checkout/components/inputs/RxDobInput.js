import React from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
// TODO: these imports should come from shared...
import { currentYear, iterate } from 'registrations/utils';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';
import { updateFormData } from 'checkout/actions';

class _RxDobInput extends React.Component {
  onChangeDay = event => {
    const { dayField, updateFormData } = this.props;
    updateFormData({ [dayField]: event.target.value });
  };

  onChangeMonth = event => {
    const { monthField, updateFormData } = this.props;
    updateFormData({ [monthField]: event.target.value });
  };

  onChangeYear = event => {
    const { yearField, updateFormData } = this.props;
    updateFormData({ [yearField]: event.target.value });
  };

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
    const { day, required, dayError } = this.props;

    return (
      <Form.Control as="select" value={day} onChange={this.onChangeDay} required={required} isInvalid={!!dayError}>
        <option value="" disabled hidden>Day</option>

        {iterate(1, 31, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }

  renderMonthInput() {
    const { month, required, monthError } = this.props;

    return (
      <Form.Control as="select" value={month} onChange={this.onChangeMonth} required={required} isInvalid={!!monthError}>
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
    const { year, required, maxYear, yearError } = this.props;

    const startYear = maxYear || currentYear;
    const endYear = 1900;

    return (
      <Form.Control as="select" value={year} onChange={this.onChangeYear} required={required} isInvalid={!!yearError}>
        <option value="" disabled hidden>Year</option>

        {iterate(startYear, endYear, value => 
          <option key={value} value={value}>{value}</option>
        )}
      </Form.Control>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    day: state.formData[ownProps.dayField] || '',
    month: state.formData[ownProps.monthField] || '',
    year: state.formData[ownProps.yearField] || '',

    error: getValidationError(ownProps.field, state.errors),
    dayError: getValidationError(ownProps.dayField, state.errors),
    monthError: getValidationError(ownProps.monthField, state.errors),
    yearError: getValidationError(ownProps.yearField, state.errors),
  };
};

const actions = {
  updateFormData: updateFormData,
};

export const RxDobInput = connect(mapStateToProps, actions)(_RxDobInput);
