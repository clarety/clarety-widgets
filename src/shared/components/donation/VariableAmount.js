import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { t } from 'shared/translations';
import { CurrencySymbol } from 'shared/components';
import { cleanDecimal } from 'form/utils';

export const VariableAmount = ({ value, amountInfo, isSelected, onChange }) => {
  let input = React.createRef();

  return (
    <div className="mt-3 mb-1 mx-3 d-lg-none variable-amount">
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text><CurrencySymbol /></InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          placeholder={t('label.variableAmountInput', 'Enter Amount')}
          ref={input}
          value={value}
          type="text"
          onFocus={event => onChange(event.target.value)}
          onChange={event => onChange(cleanDecimal(event.target.value))}
          data-testid="variable-amount-input"
        />
      </InputGroup>
    </div>
  );
};
