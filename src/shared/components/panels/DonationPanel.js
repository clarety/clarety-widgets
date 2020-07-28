import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { FrequencySelect, SuggestedAmount, SuggestedAmountLg, VariableAmount, VariableAmountLg } from 'shared/components';
import { currency } from 'shared/utils';
import { ErrorMessages } from 'form/components';

export class DonationPanel extends BasePanel {
  constructor(props) {
    super(props);

    const defaults = this.getDefaults(props.priceHandles);
    this.state = { ...defaults };
  }

  onChangeFrequency = (frequency) => {
    this.setState({ frequency });
  };

  onSelectAmount = (frequency, amount, isVariableAmount = false) => {
    this.setState(prevState => ({
      selections: {
        ...prevState.selections,
        [frequency]: {
          ...prevState.selections[frequency],
          amount,
          isVariableAmount,
          variableAmount: isVariableAmount ? amount : '',
        },
      },
    }));
  };

  onSelectSchedule = (offerPaymentUid) => {
    this.setState(prevState => ({
      selections: {
        ...prevState.selections,
        recurring: {
          ...prevState.selections.recurring,
          offerPaymentUid,
        },
      },  
    }));
  };

  onClickNone = (event) => {
    event.preventDefault();
    this.onChangeFrequency('single');
    this.onSelectAmount('single', 0, false);
    this.props.nextPanel();
  };

  onClickNext = (event) => {
    event.preventDefault();

    const { addToCart, nextPanel } = this.props;
    const { frequency, selections } = this.state;

    const selection = selections[frequency];

    addToCart({
      type:            'donation',
      offerUid:        selection.offerUid,
      offerPaymentUid: selection.offerPaymentUid,
      price:           selection.amount,
    });

    nextPanel();
  };

  onClickEdit = (event) => {
    event.preventDefault();
    this.props.removeItemsWithType('donation');
    this.props.editPanel();
  }

  componentDidUpdate(prevProps) {
    const { priceHandles } = this.props;

    if (prevProps.priceHandles !== priceHandles) {
      const defaults = this.getDefaults(priceHandles);
      this.setState({ ...defaults });
    }
  }

  getDefaults(priceHandles) {
    const result = {
      frequency: null,
      selections: {},
    };

    if (priceHandles && priceHandles.length) {
      const defaultFrequency = priceHandles[0].frequency;
      const defaultSelections = {};

      for (let offer of priceHandles) {
        const defaultAmount = offer.amounts.find(amount => amount.default);

        defaultSelections[offer.frequency] = {
          offerUid:         offer.offerUid,
          offerPaymentUid:  offer.offerPaymentUid,
          amount:           defaultAmount ? defaultAmount.amount : 0,
          isVariableAmount: false,
        };
      }

      result.frequency = defaultFrequency;
      result.selections = defaultSelections;
    }

    return result;
  }

  reset() {
    this.props.removeItemsWithType('donation');
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="donation-panel">
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
    const { layout, index, settings } = this.props;
    const { frequency } = this.state;
    
    const offer = this.getOffer(frequency);
    const variableAmount = this.getVariableAmount(offer);

    return (
      <PanelContainer layout={layout} status="edit" className="donation-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('donationPanel.editTitle', 'Make A Donation')}
        />
        <PanelBody layout={layout} status="edit">
          
          <p className="message-text">{t('donationPanel.message', '')}</p>

          <Form onSubmit={this.onClickNext}>

            <ErrorMessages />

            {settings.showFrequencySelect &&
              <FrequencySelect
                value={frequency}
                onChange={this.onChangeFrequency}
              />
            }

            <div className="card-deck flex-column mt-3 mx-n3 text-left flex-lg-row">
              {offer.amounts.map(this.renderSuggestedAmount)}
              {this.renderVariableAmount(variableAmount)}
            </div>

            <div className="panel-actions">
              {settings.showNoneButton &&
                <Button onClick={this.onClickNone} variant="secondary">
                  {t('btn.none', 'None')}
                </Button>
              }
              
              <Button type="submit"> 
                {t('btn.next', 'Next')}
              </Button>
            </div>

          </Form>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index } = this.props;
    const selectedAmount = this.getSelectedAmount();

    return (
      <PanelContainer layout={layout} status="done" className="donation-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={t('donationPanel.doneTitle', 'Your Donation')}
          onPressEdit={this.onPressEdit}
        />
        <PanelBody layout={layout} status="done">

          <p>{selectedAmount}</p>

          <Button onClick={this.onClickEdit}>
            {t('btn.edit', 'Edit')}
          </Button>

        </PanelBody>
      </PanelContainer>
    );
  }

  renderSuggestedAmount = suggestedAmount => {
    // Ignore variable amount, we'll add a field below the suggested amounts.
    if (suggestedAmount.variable) return null;

    const { frequency, selections } = this.state;
    const currentSelection = selections[frequency];

    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;
    return (
      <React.Fragment key={suggestedAmount.amount}>
        <SuggestedAmount
          key={suggestedAmount.amount}
          amountInfo={suggestedAmount}
          onClick={amount => this.onSelectAmount(frequency, amount)}
          isSelected={isSelected}
        />
        <SuggestedAmountLg
          key={`${suggestedAmount.amount}-lg`}
          amountInfo={suggestedAmount}
          onClick={amount => this.onSelectAmount(frequency, amount)}
          isSelected={isSelected}
        />
      </React.Fragment>
    );
  };

  renderVariableAmount(variableAmount) {
    if (!variableAmount) return null;

    const { frequency, selections } = this.state;
    const currentSelection = selections[frequency];

    return (
      <React.Fragment>
        <VariableAmount
          amountInfo={variableAmount}
          value={currentSelection.variableAmount || ''}
          onChange={amount => this.onSelectAmount(frequency, amount, true)}
          isSelected={currentSelection.isVariableAmount}
        />
        <VariableAmountLg
          amountInfo={variableAmount}
          value={currentSelection.variableAmount || ''}
          onChange={amount => this.onSelectAmount(frequency, amount, true)}
          isSelected={currentSelection.isVariableAmount}
        />
      </React.Fragment>
    );
  }

  getOffer(frequency) {
    return this.props.priceHandles.find(offer => offer.frequency === frequency);
  }

  getVariableAmount(offer) {
    return offer.amounts.find(amount => amount.variable === true);
  }

  getSelectedAmount() {
    const { frequency, selections } = this.state;
  
    const selection = selections[frequency];
  
    if (!selection || !selection.amount || selection.amount === '0') return 'None';

    return currency(Number(selection.amount));
  }
}
