import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';

import { BaseFormView } from './form/views/BaseFormView';
import { ErrorMessages, TextInput, SelectInput, FormElement, SubmitButton } from './form/components';
import { connectFormToStore } from './form/utils/form-utils';

import SubscribeWidget from './subscribe/views/SubscribeWidget';

import { DonateWidget } from './donate/views/DonateWidget';
import { connectDonateWidget } from './donate/utils/donate-utils';
import { DetailsPanel } from './donate/views/DetailsPanel';
import { connectDetailsPanel } from './donate/utils/donate-utils';
import { setupAxiosMock } from './donate/mock-data/axios-mock';

export default {
  // Shared
  config: ClaretyConfig.init,
  widget: renderWidget,

  // Form
  BaseFormView,
  ErrorMessages,
  TextInput,
  SelectInput,
  FormElement,
  SubmitButton,
  connectFormToStore,

  // Subscribe
  SubscribeWidget,

  // Donate
  DonateWidget,
  DetailsPanel,
  connectDonateWidget,
  connectDetailsPanel,
  setupAxiosMock, // TEMP
};
