import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { t } from 'shared/translations';
import { CurrencySymbol } from 'shared/components';
import { cleanDecimal } from 'form/utils';
import { FieldError } from 'form/components';

export const VariableAmount = ({ amountInfo, value, placeholder, isSelected, autoFocus, onChange, onMouseEnter, onMouseLeave, error }) => (
  <div className={`variable-amount ${isSelected ? 'variable-amount--selected' : ''}`}>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text><CurrencySymbol /></InputGroup.Text>
      </InputGroup.Prepend>

      <Form.Control
        value={value}
        placeholder={placeholder || amountInfo.title || t('other-amount', 'Other Amount')}
        type="tel"
        onFocus={event => onChange(event.target.value)}
        onChange={event => onChange(cleanDecimal(event.target.value))}
        onMouseEnter={() => onMouseEnter(amountInfo)}
        onMouseLeave={() => onMouseLeave(amountInfo)}
        data-testid="variable-amount-input"
        isInvalid={!!error}
        autoFocus={autoFocus}
      />

      <FieldError error={error} />
    </InputGroup>
  </div>
);
