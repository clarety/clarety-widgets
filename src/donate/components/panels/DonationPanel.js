import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Breakpoint } from 'react-socks';
import { requiredField } from 'shared/utils';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { SubmitButton, BackButton, ErrorMessages, SelectInput } from 'form/components';
import { FrequencySelect, ScheduleSelectButtonGroup, ScheduleSelectDropdown, DonatePayPalBtn } from 'donate/components';

export class DonationPanel extends BasePanel {
  onShowPanel() {
    const { layout, clearItems } = this.props;
    if (layout === 'tabs') clearItems();
  }

  onMouseEnterAmount = (amountInfo) => {
    // Override in subclass.
  };

  onMouseLeaveAmount = (amountInfo) => {
    // Override in subclass.
  };

  onSelectAmount = (frequency, amount, isVariableAmount) => {
    this.props.selectAmount(frequency, amount, isVariableAmount);
  };

  onSelectSchedule = (offerPaymentUid) => {
    this.props.selectSchedule(offerPaymentUid);
  };

  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout } = this.props;

    if (layout === 'page') return;

    const isValid = this.validate();
    if (!isValid) return;
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    nextPanel();
  };

  validate() {
    const errors = [];
    this.validateFields(errors);

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { selections, frequency, formData, givingTypeOptions } = this.props;

    // Make sure an amount has been selected.
    const selection = selections[frequency];
    if (!Number(selection.amount)) {
      errors.push({ message: t('invalid-donation', 'Please select a donation amount') });
    }

    if (givingTypeOptions) {
      requiredField(errors, formData, 'saleline.givingType');
    }
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
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="donation-panel">
        {this.renderHeader()}

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>          
          {this.renderErrorMessages()}
          {this.renderFrequencySelect()}
          {this.renderScheduleSelect()}
          {this.renderPriceHandles()}
          {this.renderGivingType()}
        </PanelBody>

        {this.renderFooter()}
      </PanelContainer>
    );
  }

  renderHeader() {
    const { layout, index, settings } = this.props;
    if (settings.hideHeader) return null;

    return (
      <PanelHeader
        status="edit"
        layout={layout}
        number={index + 1}
        title={settings.title}
      />
    );
  }

  renderErrorMessages() {
    if (this.props.layout === 'page') return null;

    return <ErrorMessages />;
  }

  renderFrequencySelect() {
    const { settings } = this.props;

    return (
      <FrequencySelect
        singleLabel={settings.singleLabel || t('single-gift', 'Single Gift')}
        recurringLabel={settings.recurringLabel || t('monthly-gift', 'Monthly Gift')}
      />
    );
  }

  renderScheduleSelect() {
    const { frequency, selections, settings } = this.props;
    const offer = this._getOffer(frequency);

    if (frequency !== 'recurring' || !offer.schedules || offer.schedules.length === 1) {
      return null;
    }

    const value = selections['recurring'].offerPaymentUid;

    return (
      <div className="schedule-select">
        <h3>{settings.scheduleSelectHeading || t('select-frequency', 'Select Frequency')}</h3>

        {offer.schedules.length > 3
          ? <ScheduleSelectDropdown
              value={value}
              schedules={offer.schedules}
              onChange={this.onSelectSchedule}
            />
            
          : <ScheduleSelectButtonGroup
              value={value}
              schedules={offer.schedules}
              onChange={this.onSelectSchedule}
            />
        }
      </div>
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

    const { selections, frequency, resources } = this.props;
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
      />
    );
  }

  renderGivingType() {
    const { givingTypeOptions } = this.props;
    if (!givingTypeOptions) return null;

    return (
      <div className="giving-type">
        <Row>
          <Col>
            <Form.Group controlId="givingType">
              <Form.Label>{t('give-to', 'Give To')}</Form.Label>
              <SelectInput
                field="saleline.givingType"
                options={givingTypeOptions}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
    );
  }

  renderFooter() {
    const { layout, isBusy, settings, index } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>

        <Form.Row>
          <DonatePayPalBtn />
        </Form.Row>

        <Form.Row className="justify-content-center">
          {index !== 0 &&
            <Col xs={6}>
              <BackButton
                title={settings.backBtnText || t('back', 'Back')}
                onClick={this.onPressBack}
              />
            </Col>
          }

          <Col xs={index !== 0 ? 6 : 12}>
            <SubmitButton
              title={settings.submitBtnText || t('next', 'Next')}
              testId="next-button"
            />
          </Col>
        </Form.Row>
      </PanelFooter>
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

  _getDefaultAmountInfo(frequency) {
    const offer = this._getOffer(frequency);
    const defaultAmount = offer.amounts.find(amountInfo => amountInfo.default);
    return defaultAmount;
  }

  _getSelectedAmountInfo() {
    const { selections, frequency } = this.props;

    const offer = this._getOffer(frequency);
    const selection = selections[frequency];

    const amount = selection.isVariableAmount
      ? offer.amounts.find(amount => amount.variable)
      : offer.amounts.find(amount => amount.amount === selection.amount);
    
    return amount;
  }
}
