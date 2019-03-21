import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

const ErrorMessages = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <Alert variant="danger">
      <ul className="ml-3 mb-0">
        {errors.map((error, idx) => <li key={idx}>{error.message}</li>)}
      </ul>
    </Alert>
  );
};

const mapStateToProps = state => {
  return {
    // Filter out any field errors.
    errors: state.validationErrors.filter(error => !error.field),
  };
};

export default connect(mapStateToProps)(ErrorMessages);
