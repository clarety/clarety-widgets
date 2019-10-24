import React from 'react';
import { ProgressBar } from 'react-bootstrap';

export const SosProgress = ({ sos }) => (
  <div className="sos-progress">
    <p>{sos.current} signatures <span className="goal-text">of {sos.goal}</span></p>
    <ProgressBar now={sos.current/sos.goal * 100} />
  </div>
);
