import React from 'react';
import { Card } from 'react-bootstrap';
import { _AmountPanel, FrequencySelect } from 'donate/components';
import { connectAmountPanel } from 'donate/utils';

export class _PageAmountPanel extends _AmountPanel {
  componentDidMount() {
  }

  componentDidUpdate() {
    if (this.hasError()) this.scrollIntoView();
  }

  renderContent() {
    const { frequency } = this.props;
    
    const offer = this._getOffer(frequency);
    const variableAmount = this._getVariableAmount(offer);

    return (
      <Card className="text-center">
        <Card.Body>
          <FrequencySelect />

          <div className="card-deck flex-column mt-3 mx-n3 text-left flex-lg-row">
            {offer.amounts.map(this.renderSuggestedAmount)}
            {this.renderVariableAmount(variableAmount)}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export const PageAmountPanel = connectAmountPanel(_PageAmountPanel);
