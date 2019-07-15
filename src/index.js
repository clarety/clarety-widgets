import ClaretyConfig from './shared/services/clarety-config';
import { renderWidget } from './shared/utils/widget-utils';
import { TestData } from './shared/components';

import { BaseFormView } from './form/views/BaseFormView';
import { ErrorMessages, TextInput, SelectInput, FormElement, SubmitButton, CardNumberInput, CardNameInput, ExpiryInput, CcvInput } from './form/components';
import { connectFormToStore } from './form/utils/form-utils';

import SubscribeWidget from './subscribe/views/SubscribeWidget';
export { setupAxiosMock as setupSubscribeAxiosMock } from './subscribe/mocks/axios-mock';

import DonateWidget from './donate/views/DonateWidget';
import { connectDonateWidget, connectAmountPanel, connectDetailsPanel, connectPaymentPanel, connectSuccessPanel } from './donate/utils/connect-utils';
import { AmountPanel } from './donate/views/AmountPanel';
import { DetailsPanel } from './donate/views/DetailsPanel';
import { PaymentPanel } from './donate/views/PaymentPanel';
import { SuccessPanel } from './donate/views/SuccessPanel';
import { FrequencySelect, SuggestedAmount, VariableAmount } from './donate/components';
import { setupAxiosMock } from './donate/mocks/axios-mock';

export default {
  // Shared
  config: ClaretyConfig.init,
  widget: renderWidget,
  TestData,

  // Form
  BaseFormView,
  ErrorMessages,
  TextInput,
  SelectInput,
  FormElement,
  SubmitButton,
  CardNumberInput,
  CardNameInput,
  ExpiryInput,
  CcvInput,
  connectFormToStore,

  // Subscribe
  SubscribeWidget,

  // Donate
  // TODO: namespacing.
  DonateWidget,
  AmountPanel,
  DetailsPanel,
  PaymentPanel,
  SuccessPanel,
  FrequencySelect,
  SuggestedAmount,
  VariableAmount,
  connectDonateWidget,
  connectAmountPanel,
  connectDetailsPanel,
  connectPaymentPanel,
  connectSuccessPanel,
  setupAxiosMock, // TEMP
};
