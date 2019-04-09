import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';

import { BaseFormView } from './form/views/BaseFormView';
import { ErrorMessages, TextInput, SelectInput, FormElement, SubmitButton } from './form/components';
import { connectFormToStore } from './form/utils/form-utils';

import SubscribeFormView from './subscribe/views/SubscribeFormView';

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
  SubscribeFormView,
};
