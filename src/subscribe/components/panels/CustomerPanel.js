import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { requiredField, emailField } from 'shared/utils';
import { InputGroup } from 'react-bootstrap';
import { getLanguage, t } from 'shared/translations';
import { TextInput, EmailInput, PhoneInput, StateInput, CountryInput, ErrorMessages, SubmitButton, FormElement } from 'form/components';

export class CustomerPanel extends BasePanel {
  onClickSubmit = async (event) => {
    event.preventDefault();

    if (this.props.isPreview) return;

    const didValidate = this.validate();
    if (!didValidate) return;
    
    const didSubmit = await this.props.onSubmit();
    if (!didSubmit) return;

    this.props.nextPanel();
  };

  validate() {
    const { formData, setErrors, settings } = this.props;
    const errors = [];

    if (settings.nameOption === 'firstandlast') {
      requiredField(errors, formData, 'customer.firstName');
      requiredField(errors, formData, 'customer.lastName');
    }

    if (settings.nameOption === 'full') {
      requiredField(errors, formData, 'customer.fullName');

      if (formData['customer.fullName'] && !formData['customer.fullName'].includes(' ')) {
        errors.push({
          field: 'customer.fullName',
          message: t('invalid-full-name', 'Please enter your full name'),
        });
      }
    }

    emailField(errors, formData, 'customer.email');

    if (settings.requireMobile) {
      requiredField(errors, formData, 'customer.mobile');
    }

    if (settings.showCountry) {
      requiredField(errors, formData, 'customer.billing.country');
    }

    setErrors(errors);
    return errors.length === 0;
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={t('personal-details', 'Personal Details')}
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
          <ErrorMessages />
          {this.renderCustomerForm()}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderCustomerForm() {
    const { defaultCountry } = this.props;
    const { nameOption, showMobile, showPhoneCountrySelect, showState, showCountry, buttonText } = this.props.settings;

    return (
      <Form onSubmit={this.onClickSubmit}>
        
        <InputGroup>
          {(nameOption === 'firstandlast' || !nameOption) &&
            <React.Fragment>
              <TextInput field="customer.firstName" placeholder={t('first-name', 'First Name')} hideErrors required />
              <TextInput field="customer.lastName" placeholder={t('last-name', 'Last Name')} hideErrors required />
            </React.Fragment>
          }

          {nameOption === 'full' &&
            <TextInput field="customer.fullName" placeholder={t('full-name', 'Full Name')} hideErrors required />
          }
          
          <EmailInput field="customer.email" type="email" placeholder={t('email', 'Email')} hideErrors required />

          {showMobile && 
            <PhoneInput
              field="customer.mobile"
              placeholder={t('mobile', 'Mobile')}
              showCountrySelect={showPhoneCountrySelect}
              hideErrors
              required
            />
          }

          {showState &&
            <StateInput field="customer.billing.state" placeholder={t('state', 'State')} country="AU" hideErrors required />
          }

          {showCountry
            ? <CountryInput field="customer.billing.country" initialValue={defaultCountry} placeholder={t('country', 'Country')} hideErrors required />
            : <FormElement field="customer.billing.country" value={defaultCountry} />
          }

          <InputGroup.Append>
            <SubmitButton title={buttonText || t('opt-in', 'Sign Up')} />
          </InputGroup.Append>
        </InputGroup>

        <ErrorMessages showAll />

        <FormElement
          field="customer.language"
          value={getLanguage()}
        />

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
