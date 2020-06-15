import React from 'react';
import { connect } from 'react-redux';
import { getCurrency } from 'shared/selectors';

export const _Currency = ({ currency, amount }) => (
  <React.Fragment>
    {currency.code} {currency.symbol}{(Number(amount) || 0).toFixed(2)}
  </React.Fragment>
);

const mapStateToProps = (state, ownProps) => {
  return {
    currency: getCurrency(state),
  };
};

export const Currency = connect(mapStateToProps)(_Currency);
