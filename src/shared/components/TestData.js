import React from 'react';
import ClarityConfig from '../services/clarety-config';

export const TestData = ({ testId, data }) => {
  if (ClarityConfig.get('env') !== 'dev') return null;

  return <div data-testid={testId} data-testdata={JSON.stringify(data)}></div>
};
