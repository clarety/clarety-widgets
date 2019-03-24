import { BaseSubscribeView } from './subscribe/views/BaseSubscribeView';
import SubscribeForm from './subscribe/components/SubscribeForm';
import ErrorMessages from './subscribe/components/ErrorMessages';
import TextInput from './subscribe/components/TextInput';
import SelectInput from './subscribe/components/SelectInput';
import SubmitButton from './subscribe/components/SubmitButton';
import { connectStore } from './subscribe/utils/store-utils';
import ClaretyConfig from './subscribe/utils/clarety-config';
import render from './subscribe/utils/clarety-render';

export default {
  config: ClaretyConfig.init,
  widget: render,

  BaseSubscribeView,
  SubscribeForm,
  ErrorMessages,
  TextInput,
  SelectInput,
  SubmitButton,
  connectStore,
};
