import React from 'react';
import { Card, Form, Col } from 'react-bootstrap';
import { SubmitButton, ErrorMessages } from 'form/components';
import { StepIndicator, FrequencySelect, SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg } from 'donate/components';
import { connectAmountPanel } from 'donate/utils';

export class _AmountPanel extends React.Component {
  componentWillMount() {
    this.props.clearItems();
  }

  onSubmit = event => {
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

  renderSuggestedAmount = suggestedAmount => {
    const { selections, frequency, selectAmount, forceMd } = this.props;
    const currentSelection = selections[frequency];

    // Ignore variable amount, we'll add a field below the suggested amounts.
    if (suggestedAmount.variable) return null;

    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;
    return (
      <React.Fragment key={suggestedAmount.amount}>
        <SuggestedAmount
          key={suggestedAmount.amount}
          amountInfo={suggestedAmount}
          onClick={amount => selectAmount(frequency, amount)}
          isSelected={isSelected}
          forceMd={forceMd}
        />
        <SuggestedAmountLg
          key={`${suggestedAmount.amount}-lg`}
          amountInfo={suggestedAmount}
          onClick={amount => selectAmount(frequency, amount)}
          isSelected={isSelected}
          forceMd={forceMd}
        />
      </React.Fragment>
    );
  };

  renderVariableAmount(variableAmount) {
    if (!variableAmount) return null;

    const { selections, frequency, selectAmount, forceMd } = this.props;
    const currentSelection = selections[frequency];

    return (
      <React.Fragment>
        <VariableAmount
          value={currentSelection.variableAmount || ''}
          onChange={amount => selectAmount(frequency, amount, true)}
          isSelected={currentSelection.isVariableAmount}
          forceMd={forceMd}
        />
        <VariableAmountLg
          value={currentSelection.variableAmount || ''}
          amountInfo={variableAmount}
          onChange={amount => selectAmount(frequency, amount, true)}
          isSelected={currentSelection.isVariableAmount}
          forceMd={forceMd}
        />
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

export const AmountPanel = connectAmountPanel(_AmountPanel);
