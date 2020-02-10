import React from 'react';
import { Card } from 'react-bootstrap';
import { _DonationPanel, FrequencySelect } from 'donate/components';
import { connectDonationPanel } from 'donate/utils';

export class _PageDonationPanel extends _DonationPanel {
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

export const PageDonationPanel = connectDonationPanel(_PageDonationPanel);
