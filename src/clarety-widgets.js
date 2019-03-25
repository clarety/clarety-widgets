import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import { BaseFormView } from './shared/views/BaseFormView';
import SubscribeFormView from './shared/views/SubscribeFormView';
import ErrorMessages from './shared/components/ErrorMessages';
import TextInput from './shared/components/TextInput';
import SelectInput from './shared/components/SelectInput';
import FormElement from './shared/components/FormElement';
import SubmitButton from './shared/components/SubmitButton';
import { connectFormToStore } from './shared/utils/form-utils';

export default {
  config: ClaretyConfig.init,
  widget: renderWidget,

  BaseFormView,
  SubscribeFormView,
  ErrorMessages,
  TextInput,
  SelectInput,
  FormElement,
  SubmitButton,
  connectFormToStore,
};
