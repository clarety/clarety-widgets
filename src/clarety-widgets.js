import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';

import { BaseFormView } from './form/views/BaseFormView';
import ErrorMessages from './form/components/ErrorMessages';
import TextInput from './form/components/TextInput';
import SelectInput from './form/components/SelectInput';
import FormElement from './form/components/FormElement';
import SubmitButton from './form/components/SubmitButton';
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
