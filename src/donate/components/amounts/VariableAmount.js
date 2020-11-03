import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { t } from 'shared/translations';
import { CurrencySymbol } from 'shared/components';
import { cleanDecimal } from 'form/utils';

export const VariableAmount = ({ amountInfo, value, placeholder, isSelected, onChange, onMouseEnter, onMouseLeave }) => (
  <div className={`variable-amount ${isSelected ? 'variable-amount--selected' : ''}`}>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text><CurrencySymbol /></InputGroup.Text>
      </InputGroup.Prepend>

      <Form.Control
        value={value}
        placeholder={placeholder || t('other-amount')}
        type="tel"
        onFocus={event => onChange(event.target.value)}
        onChange={event => onChange(cleanDecimal(event.target.value))}
        onMouseEnter={() => onMouseEnter(amountInfo)}
        onMouseLeave={() => onMouseLeave(amountInfo)}
        data-testid="variable-amount-input"
      />
    </InputGroup>
  </div>
);
