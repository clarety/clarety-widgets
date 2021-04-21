import { SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg, SuggestedAmountPriceOnly } from 'donate/components';

export function setupDefaultResources(resources) {
  resources.setComponent('SuggestedAmount', SuggestedAmount);
  resources.setComponent('VariableAmount', VariableAmount);

  resources.setComponent('SuggestedAmountLg', SuggestedAmountLg);
  resources.setComponent('VariableAmountLg', VariableAmountLg);
  
  resources.setComponent('SuggestedAmountPriceOnly', SuggestedAmountPriceOnly);
  resources.setComponent('VariableAmountPriceOnly', VariableAmount);
}
