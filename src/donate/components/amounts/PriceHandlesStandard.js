import React from 'react';
import { Breakpoint } from 'react-socks';
import { getValidationError } from 'form/utils';

export class PriceHandlesStandard extends React.Component {
  onMouseEnterAmount = (amountInfo) => {
    // Override in subclass.
  };

  onMouseLeaveAmount = (amountInfo) => {
    // Override in subclass.
  };

  onSelectAmount = (frequency, amount, isVariableAmount) => {
    this.props.selectAmount(frequency, amount, isVariableAmount);
  };

  getVariableAmount(offer) {
    return offer.amounts.find(amount => amount.variable === true);
  };

  getDefaultAmountInfo(frequency) {
    const { offer } = this.props;
    const defaultAmount = offer.amounts.find(amountInfo => amountInfo.default) || offer.amounts[0];
    return defaultAmount;
  }

  getSelectedAmountInfo() {
    const { selections, frequency, offer } = this.props;
    const selection = selections[frequency];

    const amount = selection.isVariableAmount
      ? offer.amounts.find(amount => amount.variable)
      : offer.amounts.find(amount => amount.amount === selection.amount);
    
    return amount;
  }

  render() {
    const { layout, offer } = this.props;
    
    const variableAmount = this.getVariableAmount(offer);

    const smPriceHandles = (
      <div className="price-handles" data-testid="suggested-amounts">
        {offer.amounts.map((amount, index) =>
          this.renderSuggestedAmount(amount, index, 'SuggestedAmount')
        )}
        {this.renderVariableAmount(variableAmount, 'VariableAmount')}
      </div>
    );

    const lgPriceHandles = (
      <div className="price-handles-lg" data-testid="suggested-amounts-lg">
        {offer.amounts.map((amount, index) =>
          this.renderSuggestedAmount(amount, index, 'SuggestedAmountLg')
        )}
        {this.renderVariableAmount(variableAmount, 'VariableAmountLg')}
      </div>
    );

    if (layout === 'tabs') {
      return smPriceHandles;
    }

    return (
      <React.Fragment>
        <Breakpoint medium down>
          {smPriceHandles}
        </Breakpoint>

        <Breakpoint large up>
          {lgPriceHandles}
        </Breakpoint>
      </React.Fragment>
    );
  }

  renderSuggestedAmount = (suggestedAmount, index, componentName) => {
    const { selections, frequency, resources } = this.props;
    const currentSelection = selections[frequency];

    // Ignore variable amount, we'll add a field below the suggested amounts.
    if (suggestedAmount.variable) return null;

    const SuggestedAmount = resources.getComponent(componentName);
    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;

    return (
      <SuggestedAmount
        key={suggestedAmount.amount}
        amountInfo={suggestedAmount}
        hideCents={this.props.hideCents}
        onClick={amount => this.onSelectAmount(frequency, amount, false)}
        onMouseEnter={this.onMouseEnterAmount}
        onMouseLeave={this.onMouseLeaveAmount}
        isSelected={isSelected}
        index={index}
      />
    );
  };

  renderVariableAmount(variableAmount, componentName) {
    if (!variableAmount) return null;

    const { selections, frequency, resources, errors } = this.props;
    const currentSelection = selections[frequency];
    const VariableAmount = resources.getComponent(componentName);

    return (
      <VariableAmount
        amountInfo={variableAmount}
        value={currentSelection.variableAmount || ''}
        onChange={amount => this.onSelectAmount(frequency, amount, true)}
        onMouseEnter={this.onMouseEnterAmount}
        onMouseLeave={this.onMouseLeaveAmount}
        isSelected={currentSelection.isVariableAmount}
        error={errors && getValidationError('variable-amount', errors)}
      />
    );
  }
}
