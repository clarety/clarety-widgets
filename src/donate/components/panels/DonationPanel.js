import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { requiredField, emailField, dateTimeField, futureDateTimeField } from 'shared/utils';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { Label, SubmitButton, BackButton, ErrorMessages, SelectInput, TextInput, EmailInput, TextAreaInput, DateTimeInput } from 'form/components';
import { PriceHandlesStandard, PriceHandlesPriceOnly } from 'donate/components';
import { FrequencySelect, ScheduleSelectButtonGroup, ScheduleSelectDropdown, CoverFeesCheckbox } from 'donate/components';

export class DonationPanel extends BasePanel {
  onEditPanel() {
    const { removeAllDonationsFromCart, upsellEnabled, resetRgUpsell } = this.props;
    removeAllDonationsFromCart();
    if (upsellEnabled) resetRgUpsell();
  }

  onSelectSchedule = (offerPaymentUid) => {
    this.props.selectSchedule(offerPaymentUid);
  };

  onSelectECard = (eCardProductUid) => {
    this.props.setFormData({
      'eCard.productUid': eCardProductUid,
    });
  };

  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout, isPreview, upsellEnabled, maybeShowRgUpsell } = this.props;

    if (layout === 'page') return;
    if (isPreview) return nextPanel();

    const isValid = this.validate();
    if (!isValid) {
      this.scrollIntoView();
      return;
    }
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    if (upsellEnabled) {
      maybeShowRgUpsell();
    }

    nextPanel();
  };

  validate() {
    const errors = [];
    this.validateFields(errors);

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { selections, frequency, formData, givingTypeOptions, settings, currency } = this.props;

    // Make sure an amount has been selected. 'None' may be a valid selection depending on settings.
    const selection = selections[frequency];
    const didSelectNone = settings.allowNone && selection.amount === null;
    if (!didSelectNone) {
      if (!Number(selection.amount)) {
        errors.push({
          message: t('invalid-donation', 'Please select a donation amount'),
        });
      } else if (settings.minimumDonationAmount && Number(selection.amount) < settings.minimumDonationAmount) {
        const currencySymbol = currency ? currency.symbol : '$';
        const minAmountText = currencySymbol + settings.minimumDonationAmount.toFixed(2);
        errors.push({
          message: t('invalid-donation-minimum', `Kindly note the minimum online donation is {{amount}}`, { amount: minAmountText }),
        });
      }
    }

    if (givingTypeOptions) {
      requiredField(errors, formData, 'saleline.givingType');

      if (this.isOtherGivingType()) {
        requiredField(errors, formData, 'saleline.otherGivingType');
      }
    }

    if (!!formData['eCard.productUid']) {
      this.validateECardFields(errors);
    }
  }

  validateECardFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'eCard.firstName');
    requiredField(errors, formData, 'eCard.lastName');
    requiredField(errors, formData, 'eCard.email');
    emailField(errors, formData, 'eCard.email');
    requiredField(errors, formData, 'eCard.message');
    requiredField(errors, formData, 'eCard.date');
    dateTimeField(errors, formData, 'eCard.date');
    futureDateTimeField(errors, formData, 'eCard.date');
  }

  isOtherGivingType() {
    const givingType = this.props.formData['saleline.givingType'] || '';
    return givingType.toLowerCase() === 'other';
  }

  getOffer(frequency) {
    return this.props.offers.find(offer => offer.frequency === frequency);
  };

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
    const { layout, isBusy, offers } = this.props;

    if (!offers || !offers.length) {
      return null;
    }

    return (
      <PanelContainer layout={layout} status="edit" className="donation-panel">
        {this.renderHeader()}

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>          
          {this.renderErrorMessages()}
          {this.renderFrequencySelect()}
          {this.renderScheduleSelect()}
          {this.renderPriceHandles()}
          {this.renderGivingType()}
          {this.renderECardSection()}
          {this.renderCommentInput()}
          {this.renderCoverFeesCheckbox()}
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
    if (settings.showFrequencySelect === false) return null;

    return (
      <FrequencySelect
        singleLabel={settings.singleLabel || t('single-gift', 'Single Gift')}
        recurringLabel={settings.recurringLabel || t('monthly-gift', 'Monthly Gift')}
      />
    );
  }

  renderScheduleSelect() {
    const { frequency, selections, settings } = this.props;
    if (frequency !== 'recurring') return null;

    const offer = this.getOffer('recurring');
    if (!offer.schedules || offer.schedules.length < 2) return null;

    const value = selections['recurring'].offerPaymentUid;

    let scheduleSelectStyle = settings.scheduleSelectStyle || 'auto';
    if (scheduleSelectStyle === 'auto') {
      scheduleSelectStyle = offer.schedules.length > 2 ? 'dropdown' : 'button-group';
    }

    return (
      <div className="schedule-select">
        <h3>{settings.scheduleSelectHeading || t('select-frequency', 'Select Frequency')}</h3>

        {scheduleSelectStyle === 'dropdown' &&
          <ScheduleSelectDropdown
            value={value}
            schedules={offer.schedules}
            onChange={this.onSelectSchedule}
          />
        }

        {scheduleSelectStyle === 'button-group' &&
          <ScheduleSelectButtonGroup
            value={value}
            schedules={offer.schedules}
            onChange={this.onSelectSchedule}
          />
        }
      </div>
    );
  }

  renderPriceHandles() {
    const { frequency, layout, settings, selections, resources, errors, selectAmount } = this.props;

    const offer = this.getOffer(frequency);
    const PriceHandlesComponent = this.getPriceHandlesComponent();
    
    return (
      <PriceHandlesComponent
        offer={offer}
        frequency={frequency}
        selections={selections}
        errors={errors}
        layout={layout}
        style={settings.priceHandleStyle}
        resources={resources}
        selectAmount={selectAmount}
        hideCents={settings.hideCents}
        allowNone={settings.allowNone}
      />
    );
  }

  getPriceHandlesComponent() {
    switch (this.props.settings.priceHandleStyle) {
      case 'price-only': return PriceHandlesPriceOnly;
      default:           return PriceHandlesStandard;
    }
  }

  renderGivingType() {
    const { givingTypeOptions } = this.props;
    if (!givingTypeOptions) return null;

    return (
      <div className="giving-type">
        <Row>
          <Col>
            <Form.Group controlId="givingType">
              <Label required>
                {t('give-to', 'Give To')}
              </Label>
              <SelectInput
                field="saleline.givingType"
                options={givingTypeOptions}
              />
            </Form.Group>
          </Col>
        </Row>

        {this.isOtherGivingType() &&
          <Row>
            <Col>
              <Form.Group controlId="otherGivingType">
                <Label required>
                  {t('please-specify', 'Please Specify')}
                </Label>
                <TextInput field="saleline.otherGivingType" />
              </Form.Group>
            </Col>
          </Row>
        }
      </div>
    );
  }

  renderECardSection() {
    const { eCardsMode, frequency, formData } = this.props;
    if (eCardsMode !== 'enabled') {
      return null;
    }

    const offer = this.getOffer(frequency);
    if (!offer.eCards || !offer.eCards.length) {
      return null;
    }

    const selectedECard = offer.eCards.find(
      (eCard) => eCard.productUid === formData['eCard.productUid']
    );

    return (
      <div className="e-cards">
        {this.renderECardSectionTitle(offer, selectedECard)}
        {this.renderECardSectionExplain(offer, selectedECard)}
        {this.renderECardSelect(offer, selectedECard)}
        {this.renderECardDetails(offer, selectedECard)}
        {this.renderECardRecipientForm(offer, selectedECard)}
        {this.renderECardMessageForm(offer, selectedECard)}
        {this.renderECardDateForm(offer, selectedECard)}
        {this.renderECardDisclaimer(offer, selectedECard)}
      </div>
    );
  }

  renderECardSectionTitle(offer, selectedECard) {
    const { settings } = this.props;

    return (
      <h3 className="e-card-section-title">
        {settings.eCardSectionTitle || t('e-card-section-title', 'Send an E-Card')}
      </h3>
    );
  }

  renderECardSectionExplain(offer, selectedECard) {
    const { settings } = this.props;

    if (settings.eCardSectionExplain) {
      return (
        <div className="e-card-section-explain">
          {settings.eCardSectionExplain}
        </div>
      );
    }

    return null;
  }

  renderECardSelect(offer, selectedECard) {
    if (offer.eCards.length < 2) return null;

    return (
      <div className="e-card-select">
        {offer.eCards.map((eCard) => {
          const isSelected = selectedECard === eCard;

          return (
            <Button
              key={eCard.productUid}
              onClick={() => this.onSelectECard(eCard.productUid)}
              variant={isSelected ? 'secondary' : 'outline-secondary'}
              className={isSelected ? 'selected' : undefined}
            >
              {eCard.name}
            </Button>
          );

        })}
      </div>
    );
  }

  renderECardDetails(offer, selectedECard) {
    if (!selectedECard) return null;

    return (
      <div className="e-card-details">
        <div className="e-card-name">{selectedECard.name}</div>

        {selectedECard.description &&
          <div className="e-card-description">{selectedECard.description}</div>
        }

        {selectedECard.imageUrl &&
          <img className="e-card-image" src={selectedECard.imageUrl} />
        }
      </div>
    );
  }

  renderECardRecipientForm(offer, selectedECard) {
    return (
      <div className="e-card-recipient-form">
        <Form.Row>
          <Col sm>
            <Form.Group controlId="eCardFirstName">
              <Label required>{t('e-card-first-name', "Recipient's First Name")}</Label>
              <TextInput field="eCard.firstName" required />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="eCardLastName">
              <Label required>{t('e-card-last-name', "Recipient's Last Name")}</Label>
              <TextInput field="eCard.lastName" required />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Group controlId="eCardEmail">
              <Label required>{t('e-card-email', "Recipient's Email")}</Label>
              <EmailInput field="eCard.email" type="email" required />
            </Form.Group>
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderECardMessageForm(offer, selectedECard) {
    const { formData } = this.props;

    const maxLength = 320;
    const charsRemaining = maxLength - (formData['eCard.message'] || '').length;

    return (
      <div className="e-card-message-form">
        <Form.Row>
          <Col>
            <Form.Group controlId="eCardMessage">
              <Label required>{t('e-card-message', 'Personal Message')}</Label>
              <TextAreaInput field="eCard.message" maxlength={maxLength} required />
              <div className="e-card-message-chars-remaining">
                {charsRemaining} {t('characters-remaining', 'Characters Remaining')}
              </div>
            </Form.Group>
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderECardDateForm(offer, selectedECard) {
    return (
      <div className="e-card-date-form">
        <Form.Row>
          <Col>
            <Form.Group controlId="eCardDate">
              <Label required>{t('e-card-date', 'Send E-Card On')}</Label>
              <DateTimeInput field="eCard.date" required />
            </Form.Group>
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderECardDisclaimer(offer, selectedECard) {
    const { settings } = this.props;

    if (settings.eCardDisclaimer) {
      return (
        <div className="e-card-disclaimer">
          {settings.eCardDisclaimer}
        </div>
      );
    }

    return null;
  }

  renderCommentInput() {
    const { settings } = this.props;
    if (!settings.showComment) return null;

    return (
      <div className="comment">
        <Row>
          <Col>
            <Form.Group>
              <Label>
                {settings.commentLabel || t('donation-comment-label', 'Donation Made In Honour Of')}
              </Label>
              <TextInput field="saleline.givingType" />
            </Form.Group>
          </Col>
        </Row>
      </div>
    );
  }

  renderCoverFeesCheckbox() {
    const { settings } = this.props;
    if (!settings.calcFeesFn) return null;

    return (
      <CoverFeesCheckbox calculateFees={settings.calcFeesFn} />
    );
  }

  renderFooter() {
    const { layout, isBusy, settings, index } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
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
}
