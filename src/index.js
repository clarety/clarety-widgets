import React from 'react';
import ClaretyConfig from './shared/utils/clarety-config';
import render from './shared/utils/clarety-render';
import SubscribeFormView from './shared/views/SubscribeFormView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

render('test-widget', <SubscribeFormView />);
