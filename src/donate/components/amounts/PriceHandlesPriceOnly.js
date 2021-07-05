import React from 'react';
import { Button } from 'react-bootstrap';
import { PriceHandlesStandard } from 'donate/components';

export class PriceHandlesPriceOnly extends PriceHandlesStandard {
  autoFocusVariableAmount = true;

  constructor(props) {
    super(props);

    this.state = {
      description: this.getDefaultDescription(props.frequency),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { frequency } = this.props;
    if (prevProps.frequency !== frequency) {
      const selectedAmountInfo = this.getSelectedAmountInfo();
      this.setState({ description: selectedAmountInfo.description });
    }
  }

  onMouseEnterAmount = (amountInfo) => {
    this.setState({ description: amountInfo.description });
  };

  onMouseLeaveAmount = (amountInfo) => {
    const selectedAmountInfo = this.getSelectedAmountInfo();
    this.setState({ description: selectedAmountInfo.description });
  };

  getDefaultDescription(frequency) {
    const defaultAmount = this.getDefaultAmountInfo(frequency);
    return defaultAmount ? defaultAmount.description : '';
  }

  render() {
    const { selections, frequency, offer } = this.props;
    const currentSelection = selections[frequency];
    
    const variableAmount = this.getVariableAmount(offer);

    return (
      <div className="price-handles--price-only">
        {offer.amounts.map((amount, index) =>
          this.renderSuggestedAmount(amount, index, 'SuggestedAmountPriceOnly')
        )}
        
        <Button
          onClick={this.onClickOther}
          variant="outline-primary"
          className={currentSelection.isVariableAmount ? 'amount selected' : 'amount'}
          onMouseEnter={() => this.onMouseEnterAmount(variableAmount)}
          onMouseLeave={() => this.onMouseLeaveAmount(variableAmount)}
        >
          {t('other', 'Other')}
        </Button>

        {currentSelection.isVariableAmount &&
          this.renderVariableAmount(variableAmount, 'VariableAmountPriceOnly')
        }

        <p className="price-handle-description">
          {this.state.description}
        </p>
      </div>
    );
  }

  onClickOther = () => {
    const { selections, frequency } = this.props;
    const currentSelection = selections[frequency];

    // Select variable amount.
    this.onSelectAmount(frequency, currentSelection.variableAmount, true);
  };
}
