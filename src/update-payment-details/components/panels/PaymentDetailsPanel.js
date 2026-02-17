import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { _PaymentPanel as BasePaymentPanel, PanelBody, PanelFooter, injectStripe, Currency } from 'shared/components';
import { SubmitButton, BackButton, CurrencyInput, FormElement } from 'form/components';
import { StripePaymentForm } from 'checkout/components/misc/StripePaymentForm';
import { DonationList } from 'update-payment-details/components';

export class _PaymentDetailsPanel extends BasePaymentPanel {
  getTitleText() {
    return t('payment-details.title', 'Update Payment Details');
  }

  renderContent() {
    const { layout, isBusy, formData } = this.props;

    const paymentType = formData['payment.type'];
    const paymentMethod = this.getPaymentMethod(paymentType);
    if (!paymentMethod) return null;

    if (this.isHKDirectDebitAuth()) {
      return this.renderHKAuthorise();
    }

    return (
      <React.Fragment>
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderErrorMessages()}
          {this.renderDescription()}
          {this.renderPaymentMethodOptions()}
          {this.renderPaymentFields(paymentMethod)}
          {this.renderSelectedDonations()}
          {this.renderCatchUpPaymentFields()}
          {this.renderTermsCheckbox()}
          {this.renderCaptcha()}
        </PanelBody>

        {this.renderFooter()}

        {this.props.modalPaymentMethod &&
          this.renderModalPaymentMethod()
        }
      </React.Fragment>
    );
  }

  renderDescription() {
    return (
      <React.Fragment>
        <p className="sub-title">{t('payment-details.subtitle', 'Please select a payment method.')}</p>
        <p>{t('payment-details.description', 'All information is securely encrypted.')}</p>
      </React.Fragment>
    );
  }

  renderStripePaymentForm(paymentMethod) {
    return (
      <StripePaymentForm
        paymentMethod={paymentMethod}
        customerInfo={this.getStripeCustomerInfo()}
        layout="accordion"
        onChange={(event) => {
          // check if the selected payment type allows catch up payments.
          if (paymentMethod.catchUpPaymentTypes) {
            const selectedPaymentType = event?.value?.type;
            if (selectedPaymentType) {
              const allowCatchUpForPaymentType = paymentMethod.catchUpPaymentTypes.includes(selectedPaymentType);
              this.setState({ allowCatchUpForPaymentType });
            }
          }
        }}
      />
    );
  }

  renderSelectedDonations() {
    const { selectedDonations } = this.props;

    return (
      <div className="selected-donations-section">
        <p>{t('update-donations-below', 'These payment details will be used to update the donations listed below.')}</p>

        <DonationList
          recurringDonations={selectedDonations}
        />
      </div>
    );
  }

  renderCatchUpPaymentFields() {
    const { selectedDonations } = this.props;

    const amount = selectedDonations.reduce((sum, donation) => sum += donation.catchUpAmount, 0);

    if (!amount || !this.state.allowCatchUpForPaymentType) {
      return <FormElement field="catchUpAmount" value="" />;
    }

    return (
      <div className="catch-up-section">
        <p className="catch-up-title">{t('catch-up.title', 'Would you like to make a catch-up donation?')}</p>
        <p className="catch-up-description">{t('catch-up.description', "Before you updated your payment details today, one or more of your most recent donations didn't go through. Would you like to make a one-time catch-up donation now?")}</p>
        <p className="catch-up-suggestion">{t('catch-up.suggested-amount', 'Suggested one-time catch up donation')}: <Currency amount={amount} /></p>

        <CurrencyInput
          field="catchUpAmount"
          placeholder={t('donation-amount', 'Donation Amount')}
          required
        />
      </div>
    );
  }

  renderFooter() {
    const { layout, isBusy, index } = this.props;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          <Col xs={6}>
            {index !== 0 &&
              <BackButton title={t('back', 'Back')} block onClick={this.onPressBack} />
            }
          </Col>
          <Col xs={6}>
            <SubmitButton title={t('save-changes', 'Save Changes')} block />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }
}

export const PaymentDetailsPanel = injectStripe(_PaymentDetailsPanel);
