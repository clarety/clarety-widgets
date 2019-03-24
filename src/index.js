import React from 'react';
import ClaretyConfig from './subscribe/utils/clarety-config';
import render from './subscribe/utils/clarety-render';
import BaseSubscribeView from './subscribe/views/BaseSubscribeView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

render('subscribe-widget',
  <BaseSubscribeView
    code="newsletter"
  />
);
