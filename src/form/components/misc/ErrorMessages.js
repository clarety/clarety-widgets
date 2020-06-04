import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

const _ErrorMessages = ({ errors }) => {
  if (!errors || !errors.length) return null;

  return (
    <Alert variant="danger" className="error-messages">
      <ul className="list-unstyled">
        {errors.map((error, index) =>
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: error.message }}
          />
        )}
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
