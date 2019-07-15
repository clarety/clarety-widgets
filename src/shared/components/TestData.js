import React from 'react';
import { ClaretyConfig } from '../services';

export const TestData = ({ testId, data }) => {
  if (ClaretyConfig.get('env') !== 'dev') return null;

  return <div data-testid={testId} data-testdata={JSON.stringify(data)}></div>
};
