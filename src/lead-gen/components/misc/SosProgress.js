import React from 'react';
import { ProgressBar } from 'react-bootstrap';

export const SosProgress = ({ current, goal }) => (
  <div className="sos-progress">
    <p>{current} signatures <span className="goal-text">of {goal}</span></p>
    <ProgressBar now={current/goal * 100} />
  </div>
);
