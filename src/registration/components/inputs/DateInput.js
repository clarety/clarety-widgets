import React from 'react';
import { Form } from 'react-bootstrap';
import DatePicker, { setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, formatISO } from 'date-fns';
import { FormContext } from 'shared/utils';
import { t, getLanguage } from 'shared/translations';
import { FieldError } from 'form/components';
import { getValidationError } from 'form/utils';

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

export class PureDateInput extends React.Component {
  constructor(props) {
    super(props);

    const locale = this.getLocale();
    if (locale) setDefaultLocale(locale);

    if (!props.value && props.initialValue !== undefined) {
      props.onChange(props.initialValue);
    }
  }

  getLocale() {
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
    this.props.onChange(this.props.field, dateString);
  };

  render() {
    const { field, label, explanation, value, error, disabled, required } = this.props;
    const date = value ? parseISO(value) : null;

    return (
      <Form.Group  controlId={field}>
        <Form.Label style={{ display: 'block' }}>
          {label}{!required && <span className="optional"> ({t('optional', 'Optional')})</span>}
        </Form.Label>

        <DatePicker
          selected={date}
          onChange={this.onChangeDate}
          dateFormat="d MMM yyyy"
          disabled={disabled}
          fixedHeight
        />

        <FieldError error={error} />

        {explanation && <p className="explanation-text">{explanation}</p>}
      </Form.Group>
    );
  }
}

export class DateInput extends React.Component {
  render() {
    const { formData, errors, onChange } = this.context;
    const error = getValidationError(this.props.field, errors);

    return (
      <PureDateInput
        {...this.props}
        value={formData[this.props.field] || ''}
        onChange={onChange}
        error={error}
      />
    );
  }
}

DateInput.contextType = FormContext;
