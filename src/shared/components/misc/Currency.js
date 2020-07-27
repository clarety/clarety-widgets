import React from 'react';
import { connect } from 'react-redux';
import { getSetting, getCurrency } from 'shared/selectors';

const _CurrencySymbol = ({ currency, hideCurrencyCode }) => (
  <React.Fragment>
    {!hideCurrencyCode && currency.code} {currency.symbol}
  </React.Fragment>
);

const _Currency = ({ amount, hideCents }) => (
  <React.Fragment>
    <CurrencySymbol />{(Number(amount) || 0).toFixed(hideCents ? 0 : 2)}
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
