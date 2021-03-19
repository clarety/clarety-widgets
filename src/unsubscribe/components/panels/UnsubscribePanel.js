import React from 'react';
import { Form } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { emailField } from 'shared/utils';
import { EmailInput, ErrorMessages, SubmitButton } from 'form/components';

export class UnsubscribePanel extends BasePanel {
  onClickSubmit = async (event) => {
    event.preventDefault();

    const didValidate = this.validate();
    if (!didValidate) return;
    
    const didSubmit = await this.props.onSubmit();
    if (!didSubmit) return;

    this.props.nextPanel();
  };

  validate() {
    const errors = [];

    this.validateFields(errors);

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { formData } = this.props;

    emailField(errors, formData, 'email');
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={t('unsubscribe-title', 'Personal Details')}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, index, isBusy, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={settings.title}
          subtitle={settings.subtitle}
        />

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          <ErrorMessages showAll />
          {this.renderCustomerForm()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderCustomerForm() {
    const { settings } = this.props;

    return (
      <Form onSubmit={this.onClickSubmit}>          
        <EmailInput field="email" type="email" placeholder={t('unsubscribe-email-placeholder', 'Please enter your email')} hideErrors required />
        <SubmitButton title={settings.buttonText || t('unsubscribe-btn', 'Unsubscribe')} />
      </Form>
    );
  }

  renderDone() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
