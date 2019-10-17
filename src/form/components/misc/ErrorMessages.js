import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

const _ErrorMessages = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert variant="danger" className="text-left">
      <ul className="ml-3 mb-0 list-unstyled">
        {errors.map((error, idx) => <li key={idx}>{error.message}</li>)}
      </ul>
    </Alert>
  );
};

const mapStateToProps = (state, ownProps) => {
  const errors = ownProps.showAll
    ? state.errors
    : state.errors.filter(error => !error.field);

  return {
    errors: errors,
  };
};

export const ErrorMessages = connect(mapStateToProps)(_ErrorMessages);
