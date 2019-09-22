import React from 'react';
import { connect } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { statuses } from 'shared/actions';

const _SubmitButton = ({ title, className, block, testId, isReady }) => (
  <Button className={`btn-submit ${className}`} block={block} disabled={!isReady} type="submit" data-testid={testId}>
    {isReady
      ? title
      : <Spinner animation="border" size="sm" />
    }
  </Button>
);

const mapStateToProps = state => {
  return {
    isReady: state.status === statuses.ready,
  };
};

export const SubmitButton = connect(mapStateToProps)(_SubmitButton);
