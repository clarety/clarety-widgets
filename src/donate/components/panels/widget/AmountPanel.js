import React from 'react';
import { connect } from 'react-redux';
import { Card, Form, Col } from 'react-bootstrap';
import { clearItems } from 'shared/actions';
import { OverrideContext } from 'shared/utils';
import { SubmitButton, ErrorMessages } from 'form/components';
import { BasePanel, StepIndicator, FrequencySelect, SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg } from 'donate/components';
import { selectAmount, submitAmountPanel } from 'donate/actions';
import { getSelectedAmount } from 'donate/selectors';

export class _AmountPanel extends BasePanel {
  componentWillMount() {
    this.props.clearItems();
  }

  onMouseEnterAmount = (amountInfo) => {
    // Override in subclass.
  };

  onSelectAmount = (frequency, amount, isVariableAmount) => {
    this.props.selectAmount(frequency, amount, isVariableAmount);
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.submitAmountPanel();
  };

  render() {
    if (this.props.frequency === null) return null;

    return (
      <form onSubmit={this.onSubmit} data-testid="amount-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { frequency, forceMd } = this.props;
    
    const offer = this._getOffer(frequency);
    const variableAmount = this._getVariableAmount(offer);

    let deckClassName = 'card-deck flex-column mt-3 mx-n3 text-left';
    if (!forceMd) deckClassName += ' flex-lg-row';

    return (
      <Card className="text-center">
        <Card.Header>
          <StepIndicator currentStep="amount" />
        </Card.Header>

        <Card.Body>
          <ErrorMessages />

          <FrequencySelect />

          <div className={deckClassName} data-testid="suggested-amounts">
            {offer.amounts.map(this.renderSuggestedAmount)}
            {this.renderVariableAmount(variableAmount)}
          </div>
        </Card.Body>

        <Card.Footer>
          <Form.Row className="justify-content-center">
            <Col lg={forceMd ? null : 5}>
              <SubmitButton title="Next" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }

  renderSuggestedAmount = (suggestedAmount, index) => {
    const { selections, frequency, forceMd } = this.props;
    const currentSelection = selections[frequency];

    const SuggestedAmountComponent = this.context.SuggestedAmount || SuggestedAmount;
    const SuggestedAmountLgComponent = this.context.SuggestedAmountLg || SuggestedAmountLg;

    // Ignore variable amount, we'll add a field below the suggested amounts.
    if (suggestedAmount.variable) return null;

    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;
    return (
      <React.Fragment key={suggestedAmount.amount}>
        <SuggestedAmountComponent
          key={suggestedAmount.amount}
          amountInfo={suggestedAmount}
          onClick={amount => this.onSelectAmount(frequency, amount, false)}
          onMouseEnter={this.onMouseEnterAmount}
          isSelected={isSelected}
          forceMd={forceMd}
          index={index}
        />
        {!forceMd &&
          <SuggestedAmountLgComponent
            key={`${suggestedAmount.amount}-lg`}
            amountInfo={suggestedAmount}
            onClick={amount => this.onSelectAmount(frequency, amount, false)}
            onMouseEnter={this.onMouseEnterAmount}
            isSelected={isSelected}
            forceMd={forceMd}
            index={index}
          />
        }
      </React.Fragment>
    );
  };

  renderVariableAmount(variableAmount) {
    if (!variableAmount) return null;

    const { selections, frequency, forceMd } = this.props;
    const currentSelection = selections[frequency];

    const VariableAmountComponent = this.context.VariableAmount || VariableAmount;
    const VariableAmountLgComponent = this.context.VariableAmountLg || VariableAmountLg;

    return (
      <React.Fragment>
        <VariableAmountComponent
          amountInfo={variableAmount}
          value={currentSelection.variableAmount || ''}
          onChange={amount => this.onSelectAmount(frequency, amount, true)}
          onMouseEnter={this.onMouseEnterAmount}
          isSelected={currentSelection.isVariableAmount}
          forceMd={forceMd}
        />
        {!forceMd &&
          <VariableAmountLgComponent
            amountInfo={variableAmount}
            value={currentSelection.variableAmount || ''}
            onChange={amount => this.onSelectAmount(frequency, amount, true)}
            onMouseEnter={this.onMouseEnterAmount}
            isSelected={currentSelection.isVariableAmount}
            forceMd={forceMd}
          />
        }
      </React.Fragment>
    );
  }

  _getOffer = frequency => {
    return this.props.offers.find(offer => offer.frequency === frequency);
  };

  _getVariableAmount = offer => {
    return offer.amounts.find(amount => amount.variable === true);
  };
}

_AmountPanel.contextType = OverrideContext;

const mapStateToProps = state => {
  const { amountPanel } = state.panels;

  return {
    offers: state.settings.priceHandles,
    frequency: amountPanel.frequency,
    selections: amountPanel.selections,
    selectedAmount: getSelectedAmount(state),
    errors: state.errors,
  };
};

const actions = {
  selectAmount: selectAmount,
  submitAmountPanel: submitAmountPanel,
  clearItems: clearItems,
};

export const connectAmountPanel = connect(mapStateToProps, actions);

export const AmountPanel = connectAmountPanel(_AmountPanel);
