import React from 'react';
import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import DonateFormView from './donate/views/DonateFormView';
import './index.css';

ClaretyConfig.init({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

renderWidget('donate-widget', <DonateFormView />);
