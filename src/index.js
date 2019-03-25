import React from 'react';
import ClaretyConfig from './shared/utils/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import SubscribeFormView from './shared/views/SubscribeFormView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

renderWidget('test-widget', <SubscribeFormView />);
