import React from 'react';
import ReactDOM from 'react-dom';
import BaseSubscribeView from './subscribe/views/BaseSubscribeView';
import './index.css';

ReactDOM.render(
  <BaseSubscribeView code="newsletter" />,
  document.getElementById('subscribe-view')
);
