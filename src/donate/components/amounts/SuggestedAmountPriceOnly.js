import React from 'react';
import { Button } from 'react-bootstrap';
import { Currency } from 'shared/components';

export const SuggestedAmountPriceOnly = ({ amountInfo, isSelected, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <Button
      onClick={() => onClick(amountInfo.amount)}
      variant="outline-primary"
      className={isSelected ? 'amount selected' : 'amount'}
      onMouseEnter={() => onMouseEnter(amountInfo)}
      onMouseLeave={() => onMouseLeave(amountInfo)}
    >
      <Currency amount={amountInfo.amount} />
    </Button>
  );
};
