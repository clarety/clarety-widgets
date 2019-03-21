import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { formStatuses } from '../actions/formStatusActions';

const SubmitButton = ({ title, className, block, isReady }) => (
  <Button className={className} block={block} disabled={!isReady} type="submit">
    {isReady ? title : <Spinner />} 
  </Button>
);

const Spinner = () => (
  <span className="spinner-border spinner-border-sm"></span>
);

const mapStateToProps = state => {
  return {
    isReady: state.formStatus === formStatuses.ready,
  };
};

export default connect(mapStateToProps)(SubmitButton);
