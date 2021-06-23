import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import DatePicker, { setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, formatISO } from 'date-fns';
import { getLanguage } from 'shared/translations';
import { updateFormData } from 'form/actions';
import { getValidationError } from 'form/utils';
import { FieldError } from 'form/components';

// Date locales.
import thLocale from 'date-fns/locale/th';
import ptLocale from 'date-fns/locale/pt';
import ruLocale from 'date-fns/locale/ru';
import esLocale from 'date-fns/locale/es';
import frLocale from 'date-fns/locale/fr';
import deLocale from 'date-fns/locale/de';
import nbLocale from 'date-fns/locale/nb';
import daLocale from 'date-fns/locale/da';
import svLocale from 'date-fns/locale/sv';
import bgLocale from 'date-fns/locale/bg';
import ukLocale from 'date-fns/locale/uk';
import elLocale from 'date-fns/locale/el';

export class _DateInput extends React.Component {
  constructor(props) {
    super(props);

    const locale = this.getLocale();
    if (locale) setDefaultLocale(locale);

    if (!props.value && props.initialValue !== undefined) {
      props.setInitialValue(props.initialValue);
    }
  }

  getLocale(language) {
    switch (getLanguage()) {
      case 'pt':     return ptLocale;
      case 'ru':     return ruLocale;
      case 'es':     return esLocale;
      case 'es-419': return esLocale;
      case 'fr':     return frLocale;
      case 'de':     return deLocale;
      case 'nb':     return nbLocale;
      case 'da':     return daLocale;
      case 'sv':     return svLocale;
      case 'bg':     return bgLocale;
      case 'uk':     return ukLocale;
      case 'el':     return elLocale;
      case 'th':     return thLocale;
      case 'km':     return undefined; // TODO: Khmer
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
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: value => dispatch(updateFormData(ownProps.field, value)),
    setInitialValue: value => dispatch(updateFormData(ownProps.field, value)),
  };
};

export const DateInput = connect(mapStateToProps, mapDispatchToProps)(_DateInput);
