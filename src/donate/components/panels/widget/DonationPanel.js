import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { Resources } from 'shared/utils';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { SubmitButton, ErrorMessages } from 'form/components';
import { FrequencySelect } from 'donate/components';

export class DonationPanel extends BasePanel {
  onShowPanel() {
    const { layout, clearItems } = this.props;
    if (layout === 'tabs') clearItems();
  }

  componentDidUpdate() {
    if (this.props.layout === 'page' && this.hasError()) {
      this.scrollIntoView();
    }
  }

  onHoverAmount = (amountInfo) => {
    // Override in subclass.
  };

  onSelectAmount = (frequency, amount, isVariableAmount) => {
    this.props.selectAmount(frequency, amount, isVariableAmount);
  };

  onPressNext = async (event) => {
    event.preventDefault();
    
    const isValid = await this.props.submitDonationPanel();
    if (isValid) this.props.nextPanel();
  };

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    return (
      <form onSubmit={this.onPressNext} data-testid="donation-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy, index, frequency, forceMd, settings } = this.props;
    
    const offer = this._getOffer(frequency);
    const variableAmount = this._getVariableAmount(offer);

    let deckClassName = 'card-deck flex-column mt-3 mx-n3';
    if (!forceMd) deckClassName += ' flex-lg-row';

    return (
      <PanelContainer layout={layout} status="edit">
        {!settings.hideHeader &&
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={settings.title}
          />
        }

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <ErrorMessages />
          <FrequencySelect />

          <div className={deckClassName} data-testid="suggested-amounts">
            {offer.amounts.map(this.renderSuggestedAmount)}
            {this.renderVariableAmount(variableAmount)}
          </div>
        </PanelBody>

        {layout !== 'page' &&
          <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
            <Form.Row className="justify-content-center">
              <Col>
                <SubmitButton title="Next" block testId="next-button" />
              </Col>
            </Form.Row>
          </PanelFooter>
        }
      </PanelContainer>
    );
  }

  renderSuggestedAmount = (suggestedAmount, index) => {
    const { selections, frequency, forceMd } = this.props;
    const currentSelection = selections[frequency];

    const SuggestedAmount = Resources.getComponent('SuggestedAmount');
    const SuggestedAmountLg = Resources.getComponent('SuggestedAmountLg');

    // Ignore variable amount, we'll add a field below the suggested amounts.
    if (suggestedAmount.variable) return null;

    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;
    return (
      <React.Fragment key={suggestedAmount.amount}>
        <SuggestedAmount
          key={suggestedAmount.amount}
          amountInfo={suggestedAmount}
          onClick={amount => this.onSelectAmount(frequency, amount, false)}
          onHover={this.onHoverAmount}
          isSelected={isSelected}
          forceMd={forceMd}
          index={index}
        />
        {!forceMd &&
          <SuggestedAmountLg
            key={`${suggestedAmount.amount}-lg`}
            amountInfo={suggestedAmount}
            onClick={amount => this.onSelectAmount(frequency, amount, false)}
            onHover={this.onHoverAmount}
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

    const VariableAmount = Resources.getComponent('VariableAmount');
    const VariableAmountLg = Resources.getComponent('VariableAmountLg');

    return (
      <React.Fragment>
        <VariableAmount
          amountInfo={variableAmount}
          value={currentSelection.variableAmount || ''}
          onChange={amount => this.onSelectAmount(frequency, amount, true)}
          onHover={this.onHoverAmount}
          isSelected={currentSelection.isVariableAmount}
          forceMd={forceMd}
        />
        {!forceMd &&
          <VariableAmountLg
            amountInfo={variableAmount}
            value={currentSelection.variableAmount || ''}
            onChange={amount => this.onSelectAmount(frequency, amount, true)}
            onHover={this.onHoverAmount}
            isSelected={currentSelection.isVariableAmount}
            forceMd={forceMd}
          />
        }
      </React.Fragment>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }

  _getOffer = frequency => {
    return this.props.offers.find(offer => offer.frequency === frequency);
  };

  _getVariableAmount = offer => {
    return offer.amounts.find(amount => amount.variable === true);
  };
}
