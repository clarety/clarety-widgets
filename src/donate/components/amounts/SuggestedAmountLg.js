import React from 'react';
import { connect } from 'react-redux';

const _SuggestedAmountLg = ({ amountInfo, isSelected, onClick, currency, onMouseEnter, onMouseLeave }) => (
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
      <div className="suggested-amount__title">{currency.code} {currency.symbol}{amountInfo.amount}</div>
      <div className="suggested-amount__text">{amountInfo.description}</div>
    </div>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  currency: state.settings.currency,
});

export const SuggestedAmountLg = connect(mapStateToProps)(_SuggestedAmountLg);
