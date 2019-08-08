import React from 'react';
import { Config } from 'clarety-utils';

export const TestData = ({ testId, data }) => {
  if (Config.get('env') !== 'dev') return null;

  return <div data-testid={testId} data-testdata={JSON.stringify(data)}></div>
};
