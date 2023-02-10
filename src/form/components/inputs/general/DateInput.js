import React from 'react';
import { connect } from 'react-redux';
import FocusTrap from 'focus-trap-react';
import { usePopper } from 'react-popper';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Form } from 'react-bootstrap';
import { parseISO, formatISO, format as formatDate } from 'date-fns';
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

function getDateLocale() {
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
    default:       return undefined;
  }
}

const thisYear = new Date().getFullYear();
const minYear = thisYear - 90;
const maxYear = thisYear + 10;

export function _DateInput({ value, error, onChange, initialValue, setInitialValue }) {
  React.useEffect(() => {
    if (!value && initialValue !== undefined) {
      setInitialValue(initialValue);
    }
  }, []);

  const date = value ? parseISO(value) : null;
  const displayDate = date ? formatDate(date, 'd MMM yyyy') : '';

  const inputRef = React.useRef(null);
  const popperRef = React.useRef(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const [isPopperOpen, setIsPopperOpen] = React.useState(false);

  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      { name: 'flip', enabled: false },
    ],
  });

  const closePopper = () => {
    setIsPopperOpen(false);
  };

  const handleButtonClick = () => {
    inputRef.current.blur();
    setIsPopperOpen(true);
  };

  const handleDaySelect = (date) => {
    if (date) {
      const isoDate = formatISO(date, { representation: 'date' });
      onChange(isoDate);
    }

    closePopper();
  };  

  return (
    <Form.Group>
      <div ref={popperRef}>
        <Form.Control
          type="text"
          onFocus={handleButtonClick}
          onChange={() => {}}
          value={displayDate}
          isInvalid={!!error}
          ref={inputRef}
        />

        <FieldError error={error} />
      </div>

      {isPopperOpen && (
        <FocusTrap
          active
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: true,
            onDeactivate: closePopper,
          }}
        >
          <div
            tabIndex={-1}
            style={{ ...popper.styles.popper, zIndex: 1000 }}
            className="dialog-sheet"
            {...popper.attributes.popper}
            ref={setPopperElement}
            role="dialog"
          >
            <div style={{ background:'white', border: '1px solid #ccc', borderRadius: 5 }}>
              <DayPicker
                initialFocus={isPopperOpen}
                mode="single"
                defaultMonth={date}
                selected={date}
                onSelect={handleDaySelect}
                fromYear={minYear}
                toYear={maxYear}
                captionLayout="dropdown"
                locale={getDateLocale()}
              />
            </div>
          </div>
        </FocusTrap>
      )}
    </Form.Group>
  );
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
