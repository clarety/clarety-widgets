import React from 'react';
import { connect } from 'react-redux';
import { getCurrency } from 'shared/selectors';

export const _Currency = ({ currency, children }) => (
  <React.Fragment>
    {currency.code} {currency.symbol}{children}
  </React.Fragment>
);

const mapStateToProps = (state, ownProps) => {
  return {
    currency: getCurrency(state),
  };
};

export const Currency = connect(mapStateToProps)(_Currency);
