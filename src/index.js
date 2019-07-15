export { default as ClaretyConfig } from './shared/services/clarety-config';
export { renderWidget } from './shared/utils/widget-utils';

export { default as SubscribeWidget } from './subscribe/views/SubscribeWidget';
export { setupAxiosMock as setupSubscribeAxiosMock } from './subscribe/mocks/axios-mock';

export { default as DonateWidget } from './donate/views/DonateWidget';
export { setupAxiosMock as setupDonateAxiosMock } from './donate/mocks/axios-mock';
