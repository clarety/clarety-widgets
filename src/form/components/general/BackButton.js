import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { statuses } from 'shared/actions';

const _BackButton = ({ title, onClick, variant, className, block, testId, disabled }) => (
  <Button
    type="button"
    variant={variant || 'link'}
    onClick={onClick}
    block={block}
    disabled={disabled}
    className={className}
    data-testid={testId}
  >
    {title} 
  </Button>
);

const mapStateToProps = state => {
  return {
    disabled: state.status !== statuses.ready,
  };
};

export const BackButton = connect(mapStateToProps)(_BackButton);
