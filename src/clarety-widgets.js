import { BaseFormView } from './shared/views/BaseFormView';
import ErrorMessages from './shared/components/ErrorMessages';
import TextInput from './shared/components/TextInput';
import SelectInput from './shared/components/SelectInput';
import HiddenInput from './shared/components/HiddenInput';
import SubmitButton from './shared/components/SubmitButton';
import { connectFormToStore } from './shared/utils/form-utils';
import ClaretyConfig from './shared/utils/clarety-config';
import render from './shared/utils/clarety-render';

export default {
  config: ClaretyConfig.init,
  widget: render,

  BaseFormView,
  ErrorMessages,
  TextInput,
  SelectInput,
  HiddenInput,
  SubmitButton,
  connectFormToStore,
};
