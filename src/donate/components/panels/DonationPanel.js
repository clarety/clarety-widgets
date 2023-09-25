import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { requiredField } from 'shared/utils';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { SubmitButton, BackButton, ErrorMessages, SelectInput, TextInput } from 'form/components';
import { PriceHandlesStandard, PriceHandlesPriceOnly } from 'donate/components';
import { FrequencySelect, ScheduleSelectButtonGroup, ScheduleSelectDropdown, CoverFeesCheckbox } from 'donate/components';

export class DonationPanel extends BasePanel {
  onEditPanel() {
    this.props.removeAllDonationsFromCart();
  }

  onSelectSchedule = (offerPaymentUid) => {
    this.props.selectSchedule(offerPaymentUid);
  };

  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout, isPreview } = this.props;

    if (layout === 'page') return;
    if (isPreview) return nextPanel();

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

    return (
      <div className="schedule-select">
        <h3>{settings.scheduleSelectHeading || t('select-frequency', 'Select Frequency')}</h3>

        {offer.schedules.length > 2
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
              <Form.Label>{t('give-to', 'Give To')}</Form.Label>
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
                <Form.Label>{t('please-specify', 'Please Specify')}</Form.Label>
                <TextInput field="saleline.otherGivingType" />
              </Form.Group>
            </Col>
          </Row>
        }
      </div>
    );
  }

  renderCommentInput() {
    const { settings } = this.props;
    if (!settings.showComment) return null;

    return (
      <div className="comment">
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>{settings.commentLabel || t('donation-comment-label', 'Donation Made In Honour Of')}</Form.Label>
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
