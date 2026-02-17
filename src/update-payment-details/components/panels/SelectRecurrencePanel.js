import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { SubmitButton, BackButton } from 'form/components';
import { recurrenceStatusClassName } from 'update-payment-details/utils';

export class SelectRecurrencePanel extends BasePanel {
  onShowPanel() {
    this.scrollIntoView();
  }

  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    if (!this.canProceed()) {
      return;
    }

    const { onSubmit, nextPanel } = this.props;

    const isValid = this.validate();
    if (!isValid) return;
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    nextPanel();
  };

  canProceed() {
    return !!(this.props.formData['salelinePaymentUids'] || []).length;
  }

  isSelected(salelinePaymentUid) {
    const selected = this.props.formData['salelinePaymentUids'] || [];
    return selected.includes(salelinePaymentUid);
  }

  toggleSelected = (salelinePaymentUid) => {
    const { formData, updateFormData } = this.props;

    const prevSelected = formData['salelinePaymentUids'] || [];

    const nextSelected = this.isSelected(salelinePaymentUid)
      ? prevSelected.filter(id => id !== salelinePaymentUid)
      : [...prevSelected, salelinePaymentUid];

      updateFormData('salelinePaymentUids', nextSelected);
  };

  validate() {
    const { formData, setErrors } = this.props;

    const errors = [];

    //NOTE: no fields require validation yet.

    setErrors(errors);
    return errors.length === 0;
  }

  getTitleText() {
    return t('select-recurrence.title', 'Your Donations');
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="select-recurrence-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={this.getTitleText()}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, recurringDonations, hasAuthError } = this.props;

    return (
      <form onSubmit={this.onPressNext}>
        <PanelContainer layout={layout} status="edit" className="select-recurrence-panel">
          {this.renderHeader()}

          <PanelBody layout={layout} status="edit" isBusy={isBusy}>
            <p className="sub-title">{t('select-recurrence.subtitle', 'Below is a summary of your recurring donations.')}</p>
            <p>{t('select-recurrence.description', 'We are unable to process donations marked as "inactive." To continue your much-needed support, please select inactive donations and click on the update button to provide new payment details.')}</p>

            {recurringDonations?.length === 0 &&
              <div className="alert alert-info">{t('select-recurrence.no-donations', "Sorry, we couldn't find any recurring donations.")}</div>
            }

            {hasAuthError &&
              <div className="alert alert-danger">{t('select-recurrence.auth-failed-error', "Sorry, this update payment details link is either expired or invalid.")}</div>
            }
          </PanelBody>

          {!!recurringDonations?.length &&
            this.renderDonationList()
          }

          {this.renderFooter()}
        </PanelContainer>
      </form>
    );
  }

  renderDonationList() {
    const { recurringDonations } = this.props;

    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="checkbox-cell"></th>
              <th className="details-cell">{t('donation', 'Donation')}</th>
              <th className="status-cell">{t('status', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {recurringDonations.map(this.renderRecurringDonation)}
          </tbody>
        </table>
      </div>
    );
  }

  renderRecurringDonation = (recurringDonation) => {
    return (
      <tr
        key={recurringDonation.salelinePaymentUid}
        onClick={() => this.toggleSelected(recurringDonation.salelinePaymentUid)}
        className="donation-row"
      >
        <td className="checkbox-cell">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={this.isSelected(recurringDonation.salelinePaymentUid)}
              readOnly
            />
          </div>
        </td>
        <td className="details-cell">
          <div className="details-amount">{recurringDonation.amount} {recurringDonation.paymentSchedule}</div>
          <div className="details-method">{recurringDonation.paymentMethod}</div>
        </td>

        <td className="status-cell">
          <div className={recurrenceStatusClassName(recurringDonation.status)}>
            {recurringDonation.status}
          </div>
        </td>
      </tr>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="select-recurrence-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={this.getTitleText()}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
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
        title={this.getTitleText()}
      />
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
            <SubmitButton title={t('update', 'Update')} block isDisabled={!this.canProceed()} />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }
}
