import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { statuses } from '../../../shared/actions';

const _SubmitButton = ({ title, className, block, testId, isReady }) => (
  <Button className={className} block={block} disabled={!isReady} type="submit" data-testid={testId}>
    {isReady ? title : <Spinner />} 
  </Button>
);

const Spinner = () => (
  <span className="spinner-border spinner-border-sm"></span>
);

const mapStateToProps = state => {
  return {
    isReady: state.status === statuses.ready,
  };
};

export const SubmitButton = connect(mapStateToProps)(_SubmitButton);
