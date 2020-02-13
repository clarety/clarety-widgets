import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { Breakpoint } from 'react-socks';
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

    const { onSubmit, nextPanel } = this.props;

    const isValid = this.validate();
    if (!isValid) return;
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    nextPanel();
  };

  validate() {
    const { selections, frequency, setErrors } = this.props;

    const errors = [];

    // Make sure an amount has been selected.
    const selection = selections[frequency];
    if (!selection.amount) {
      errors.push({
        message: 'Please select a donation amount',
      });
    }

    setErrors(errors);
    return errors.length === 0;
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="donation-panel">
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
    const { layout, isBusy, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="donation-panel">
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

          {this.renderPriceHandles()}
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

  renderPriceHandles() {
    const { frequency, layout } = this.props;
    
    const offer = this._getOffer(frequency);
    const variableAmount = this._getVariableAmount(offer);

    const singleColPriceHandles = (
      <div className="price-handles" data-testid="suggested-amounts">
        {offer.amounts.map((amount, index) =>
          this.renderSuggestedAmount(amount, index, 'SuggestedAmount')
        )}
        {this.renderVariableAmount(variableAmount, 'VariableAmount')}
      </div>
    );

    const multiColPriceHandles = (
      <div className="price-handles-lg" data-testid="suggested-amounts-lg">
        {offer.amounts.map((amount, index) =>
          this.renderSuggestedAmount(amount, index, 'SuggestedAmountLg')
        )}
        {this.renderVariableAmount(variableAmount, 'VariableAmountLg')}
      </div>
    );

    if (layout === 'tabs') {
      return singleColPriceHandles;
    }

    return (
      <React.Fragment>
        <Breakpoint medium down>
          {singleColPriceHandles}
        </Breakpoint>

        <Breakpoint large up>
          {multiColPriceHandles}
        </Breakpoint>
      </React.Fragment>
    );
  }

  renderSuggestedAmount = (suggestedAmount, index, componentName) => {
    const { selections, frequency } = this.props;
    const currentSelection = selections[frequency];

    // Ignore variable amount, we'll add a field below the suggested amounts.
    if (suggestedAmount.variable) return null;

    const SuggestedAmount = Resources.getComponent(componentName);
    const isSelected = !currentSelection.isVariableAmount && currentSelection.amount === suggestedAmount.amount;

    return (
      <SuggestedAmount
        key={suggestedAmount.amount}
        amountInfo={suggestedAmount}
        onClick={amount => this.onSelectAmount(frequency, amount, false)}
        onHover={this.onHoverAmount}
        isSelected={isSelected}
        index={index}
      />
    );
  };

  renderVariableAmount(variableAmount, componentName) {
    if (!variableAmount) return null;

    const { selections, frequency } = this.props;
    const currentSelection = selections[frequency];
    const VariableAmount = Resources.getComponent(componentName);

    return (
      <VariableAmount
        amountInfo={variableAmount}
        value={currentSelection.variableAmount || ''}
        onChange={amount => this.onSelectAmount(frequency, amount, true)}
        onHover={this.onHoverAmount}
        isSelected={currentSelection.isVariableAmount}
      />
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="donation-panel">
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
