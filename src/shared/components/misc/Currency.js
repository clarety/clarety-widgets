import React from 'react';
import { connect } from 'react-redux';
import { getSetting, getCurrency } from 'shared/selectors';

const _CurrencySymbol = ({ currency, hideCurrencyCode }) => {
  if (hideCurrencyCode || !currency.code || currency.code === 'NOK') {
    return currency.symbol;
  }

  if (currency.code === 'HKD') {
    return 'HK$';
  }

  return currency.code + ' ' + currency.symbol;
};

const _Currency = ({ amount = 0, hideCents }) => (
  <React.Fragment>
    <CurrencySymbol />{numberWithCommas(Number(amount), hideCents)}
  </React.Fragment>
);

const mapStateToProps = (state, ownProps) => {
  return {
    currency: getCurrency(state),
    hideCurrencyCode: getSetting(state, 'hideCurrencyCode'),
  };
};

export const CurrencySymbol = connect(mapStateToProps)(_CurrencySymbol);
export const Currency = connect(mapStateToProps)(_Currency);

// stolen from stack overflow and modified.
// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(number, hideCents) {
  return number
          .toFixed(hideCents ? 0 : 2)
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
