import React from 'react';
import { Currency } from 'shared/components';

export const SuggestedAmountLg = ({ amountInfo, isSelected, hideCents, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    className={`suggested-amount suggested-amount--lg ${isSelected ? 'suggested-amount--selected' : ''}`}
    onClick={() => onClick(amountInfo.amount)}
    onMouseEnter={() => onMouseEnter(amountInfo)}
    onMouseLeave={() => onMouseLeave(amountInfo)}
    data-testid={`amount-${amountInfo.amount}`}
  >
    <div
      className="suggested-amount__image"
      style={{ background: `url(${amountInfo.image}) center center / cover` }}
    />

    <div className="suggested-amount__body">
      <div className="suggested-amount__title"><Currency amount={amountInfo.amount} hideCents={hideCents} /></div>
      <div className="suggested-amount__text">{amountInfo.description}</div>
    </div>
  </div>
);
