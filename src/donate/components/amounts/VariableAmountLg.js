import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { t } from 'shared/translations';
import { CurrencySymbol } from 'shared/components';
import { cleanDecimal } from 'form/utils';

export const VariableAmountLg = ({ amountInfo, value, placeholder, isSelected, onChange, onMouseEnter, onMouseLeave }) => {
  let input = React.createRef();

  return (
    <div
      className={`variable-amount variable-amount--lg ${isSelected ? 'variable-amount--selected' : ''}`}
      onClick={() => input.current.focus()}
    >
      <div
        className="suggested-amount__image"
        style={{ background: `url(${amountInfo.image}) center center / cover` }}
      />
      <div className="suggested-amount__body">
        <div className="suggested-amount__title">
          {amountInfo.title}
        </div>
        <div className="suggested-amount__text">
          {amountInfo.description}
        </div>
        <div className="suggested-amount__input">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text><CurrencySymbol /></InputGroup.Text>
            </InputGroup.Prepend>
            
            <Form.Control
              value={value}
              placeholder={placeholder || t('other-amount')}
              ref={input}
              type="tel"
              onFocus={event => onChange(event.target.value)}
              onChange={event => onChange(cleanDecimal(event.target.value))}
              onMouseEnter={() => onMouseEnter(amountInfo)}
              onMouseLeave={() => onMouseLeave(amountInfo)}
              data-testid="variable-amount-input"
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
};
