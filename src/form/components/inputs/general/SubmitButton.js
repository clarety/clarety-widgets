import React from 'react';
import { connect } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { statuses } from 'shared/actions';

const _SubmitButton = ({ title, className, block, testId, isBusy, isDisabled }) => (
  <Button className={`btn-submit ${className}`} block={block} disabled={isDisabled || isBusy} type="submit" data-testid={testId}>
    {isBusy
      ? <Spinner animation="border" size="sm" />
      : title
    }
  </Button>
);

const mapStateToProps = state => {
  return {
    isBusy: state.status === statuses.busy,
  };
};

export const SubmitButton = connect(mapStateToProps)(_SubmitButton);
