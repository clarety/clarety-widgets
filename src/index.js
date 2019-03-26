import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import SubscribeFormView from './subscribe/views/SubscribeFormView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

renderWidget('test-widget', <SubscribeFormView />);
