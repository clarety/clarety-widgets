import React from 'react';
import ReactDOM from 'react-dom';
import ClaretyConfig from './subscribe/utils/clarety-config';
import BaseSubscribeView from './subscribe/views/BaseSubscribeView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

ReactDOM.render(
  <BaseSubscribeView code="newsletter" />,
  document.getElementById('subscribe-view')
);
