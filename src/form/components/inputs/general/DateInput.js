import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import DatePicker, { setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, formatISO } from 'date-fns';
import { getSelectedLanguage } from 'shared/selectors';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

import localeThai from 'date-fns/locale/th';

export class _DateInput extends React.Component {
  constructor(props) {
    super(props);

    this.setLangauge(props.language);

    if (!props.value && props.initialValue !== undefined) {
      props.setInitialValue(props.initialValue);
    }
  }

  setLangauge(language) {
    // TODO: add other languages...
    switch (language) {
      case 'th':
        setDefaultLocale(localeThai);
        break;
    }
  }

  onChangeDate = (date) => {
    const dateString = formatISO(date, { representation: 'date' });
    this.props.onChange(dateString);
  };

  render() {
    const { value, error } = this.props;
    const date = value ? parseISO(value) : null;

    return (
      <Form.Group>
        <DatePicker
          selected={date}
          onChange={this.onChangeDate}
          dateFormat="d MMM yyyy"
          fixedHeight
        />

        <FieldError error={error} />
      </Form.Group>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.formData[ownProps.field] || null,
    error: getValidationError(ownProps.field, state.errors),
    language: getSelectedLanguage(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => dispatch(updateFormData(ownProps.field, value)),
    setInitialValue: value => dispatch(updateFormData(ownProps.field, value)),
  };
};

export const DateInput = connect(mapStateToProps, mapDispatchToProps)(_DateInput);
