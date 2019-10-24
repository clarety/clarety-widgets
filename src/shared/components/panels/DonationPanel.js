import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Button } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FrequencySelect, SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg } from 'shared/components';
import { ErrorMessages } from 'form/components';

export class DonationPanel extends BasePanel {
  onClickNext = (event) => {
    event.preventDefault();
    this.props.nextPanel();
  };

  onClickEdit = (event) => {
    event.preventDefault();
    this.props.editPanel();
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
        />
        
        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, frequency, settings } = this.props;
    
    const offer = this._getOffer(frequency);
    const variableAmount = this._getVariableAmount(offer);

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          intlId="donationPanel.editTitle"
        />

        <PanelBody layout={layout} status="edit">
          <Form onSubmit={this.onClickNext}>

            <ErrorMessages />

            {settings.showFrequencySelect &&
              <FrequencySelect />
            }

            <div className="card-deck flex-column mt-3 mx-n3 text-left flex-lg-row">
              {offer.amounts.map(this.renderSuggestedAmount)}
              {this.renderVariableAmount(variableAmount)}
            </div>

            <div className="panel-actions">
              <Button type="submit"> 
                <FormattedMessage id="btn.next" />
              </Button>
            </div>

          </Form>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, selectedAmount } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          intlId="donationPanel.doneTitle"
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">

          <FormattedMessage
            id="donationPanel.summaryText"
            values={{ amount: selectedAmount }}
          >
            {text => <p className="lead">{text}</p>}
          </FormattedMessage>

          <Button onClick={this.onClickEdit}>
            <FormattedMessage id="btn.edit" />
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }

  renderSuggestedAmount = suggestedAmount => {
    const { selections, frequency, selectAmount } = this.props;
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
        />
        <SuggestedAmountLg
          key={`${suggestedAmount.amount}-lg`}
          amountInfo={suggestedAmount}
          onClick={amount => selectAmount(frequency, amount)}
          isSelected={isSelected}
        />
      </React.Fragment>
    );
  };

  renderVariableAmount(variableAmount) {
    if (!variableAmount) return null;

    const { selections, frequency, selectAmount } = this.props;
    const currentSelection = selections[frequency];

    return (
      <React.Fragment>
        <VariableAmount
          value={currentSelection.variableAmount || ''}
          onChange={amount => selectAmount(frequency, amount, true)}
          isSelected={currentSelection.isVariableAmount}
        />
        <VariableAmountLg
          value={currentSelection.variableAmount || ''}
          amountInfo={variableAmount}
          onChange={amount => selectAmount(frequency, amount, true)}
          isSelected={currentSelection.isVariableAmount}
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
