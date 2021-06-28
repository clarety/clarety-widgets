import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { requiredField, emailField, getSuburbLabel, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { TextInput, TextAreaInput, EmailInput, PhoneInput, NumberInput, CurrencyInput, CheckboxInput, CheckboxesInput, SelectInput, RadioInput, DateInput, StateInput, CountryInput, PostcodeInput, FileUploadInput, FormElement, SubmitButton, BackButton, ErrorMessages } from 'form/components';

export class CaseFormPanel extends BasePanel {
  onShowPanel() {

  }

  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, section, isLastSection } = this.props;

    const isValid = this.validate();
    if (!isValid) return;

    if (section === undefined || isLastSection) {
      const didSubmit = await onSubmit();
      if (!didSubmit) return;
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
    const { section } = this.props;

    if (section === undefined) {
      // Validate all fields.
      this.validateCustomerFields(errors);
      this.validateExtendFields(errors);
    } else if (section === 'customer') {
      // Only validate customer fields.
      this.validateCustomerFields(errors);
    } else {
      // Only validate extend fields for this section.
      this.validateExtendFields(errors, section);
    }
  }

  validateCustomerFields(errors) {
    const { customerElement, requiredFields, formData } = this.props;

    // Validate required.
    for (const element of customerElement.elements) {
      const fieldKey = `customer.${element.property}`;
      if (requiredFields.includes(fieldKey)) {
        requiredField(errors, formData, fieldKey);
      }
    }

    // Validate email.
    if (formData['customer.email']) {
      emailField(errors, formData, 'customer.email');
    }
  }

  validateExtendFields(errors, section = null) {
    const { requiredFields, formData } = this.props;

    const form = section !== null
      ? this.props.form.sections[section]
      : this.props.form;

    for (const field of form.extendFields) {
      const fieldKey = `extendFields.${field.columnKey}`;
      if (requiredFields.includes(fieldKey)) {
        requiredField(errors, formData, fieldKey);
      }
    }
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="case-form-panel">
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
      <form onSubmit={this.onPressNext}>
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="case-form-panel">
        {this.renderHeader()}

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderErrorMessages()}
          {this.renderForm()}
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
    return <ErrorMessages />;
  }

  renderForm() {
    const { section } = this.props;

    // No sections, render all fields.
    if (section === undefined) {
      return (
        <React.Fragment>
          {this.renderCustomerForm()}
          {this.renderExtendForm()}
        </React.Fragment>
      );
    }

    // Customer section.
    if (section === 'customer') {
      return this.renderCustomerForm();
    }

    // Extend form section.
    return this.renderExtendForm(section);
  }

  renderCustomerForm() {
    const { customerElement } = this.props;
    if (!customerElement) return null;

    return (
      <div>
        <div className="form-header">
          <h2 className="title">{t('your-details', 'Your Details')}</h2>
        </div>

        <div className="form-fields">
          {customerElement.elements.map(this.renderElement)}
        </div>
      </div>
    );
  }

  renderExtendForm(section = null) {
    const form = section !== null
      ? this.props.form.sections[section]
      : this.props.form;

    return (
      <div>
        {form.name &&
          <div className="form-header">
            <h2 className="title">{form.name}</h2>
            {form.explanation &&
              <p className="explanation">{form.explanation}</p>
            }
          </div>
        }

        <div className="form-fields">
          {form.extendFields.map(field => this.renderField(field, 'extendFields'))}
        </div>
      </div>
    );
  }

  getFieldType(field, fieldKey) {
    // Field type can be overridden via fieldTypes prop.
    // ie: use a country input for billingid instead of an address.
    return this.props.fieldTypes[fieldKey] || field.type;
  }

  renderField(field, resourceKey = null) {
    const fieldKey = resourceKey ? resourceKey + '.' + field.columnKey : field.columnKey;

    // Ignore fields that aren't in the 'shown fields' list.
    if (!this.props.shownFields.includes(fieldKey)) return null;

    switch (this.getFieldType(field, fieldKey)) {
      case 'text':        return this.renderTextField(field, fieldKey);
      case 'textarea':    return this.renderTextAreaField(field, fieldKey);
      case 'email':       return this.renderEmailField(field, fieldKey);
      case 'phonenumber': return this.renderPhoneField(field, fieldKey);
      case 'number':      return this.renderNumberField(field, fieldKey);
      case 'currency':    return this.renderCurrencyField(field, fieldKey);
      case 'checkbox':    return this.renderCheckboxField(field, fieldKey);
      case 'checkboxs':   return this.renderCheckboxesField(field, fieldKey);
      case 'select':      return this.renderSelectField(field, fieldKey);
      case 'radio':       return this.renderRadioField(field, fieldKey);
      case 'date':        return this.renderDateField(field, fieldKey);
      case 'fileupload':  return this.renderFileUploadField(field, fieldKey);
      case 'address':     return this.renderAddressField(field, fieldKey);
      case 'country':     return this.renderCountryField(field, fieldKey);
      case 'title':       return this.renderTitleField(field, fieldKey);
      case 'hidden':      return this.renderHiddenField(field, fieldKey);
    }

    console.warn(`renderField not implemented for type: ${field.type}`);
    return null;
  }

  renderElement = (element) => {
    const field = {
      columnKey: element.property,
      type:      element.additional.inputType,
      label:     element.additional.label,
      required:  element.required,
      options:   element.options,
    };

    return this.renderField(field, 'customer');
  };

  getFieldLabel(field, fieldKey) {
    return t(`${fieldKey}.label`, field.question || field.label);
  }

  renderTextField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--text">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <TextInput
          field={fieldKey}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderTextAreaField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--textarea">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <TextAreaInput
          field={fieldKey}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderEmailField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--email">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <EmailInput
          field={fieldKey}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderPhoneField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--phone">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <PhoneInput
          field={fieldKey}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderNumberField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--number">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <NumberInput
          field={fieldKey}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderCurrencyField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--currency">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <CurrencyInput
          field={fieldKey}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderCheckboxField(field, fieldKey) {
    return (
      <div key={fieldKey} className="field field--checkbox">
        <CheckboxInput
          field={fieldKey}
          label={field.question || field.label}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </div>
    );
  }

  renderCheckboxesField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--checkboxes">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <CheckboxesInput
          field={fieldKey}
          options={field.options}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderSelectField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--select">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <SelectInput
          field={fieldKey}
          options={field.options}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderRadioField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--radio">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <RadioInput
          field={fieldKey}
          options={field.options}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderDateField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--date">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <DateInput
          field={fieldKey}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderFileUploadField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--date">
        <Form.Label>{this.getFieldLabel(field, fieldKey)}</Form.Label>

        <FileUploadInput
          field={fieldKey}
          maxFiles={field.maxFiles}
          maxFileSize={field.maxFileSize}
          acceptedFileTypes={field.fileTypes}
          required={field.required}
        />

        <div className="explanation explanation--fileupload">
          {t('maximum-files', 'Maximum files')} {field.maxFiles}.
          {' '}
          {t('maximum-file-size', 'Maximum file size')} {field.maxFileSize / 1000}mb.
          {' '}
          {t('accepted-file-types', 'Accepted file types')}: {field.fileTypes.join(', ')}.
        </div>

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderAddressField(field, fieldKey) {
    const country = this.props.formData[`${fieldKey}.country`];

    return (
      <React.Fragment key={fieldKey}>
        {this.renderCountryField(field, fieldKey)}

        <Form.Row>
          <Col sm>
            <Form.Group controlId={`${fieldKey}.address1`}>
              <Form.Label>{t('street', 'Street')}</Form.Label>
              <TextInput field={`${fieldKey}.address1`} type="street" />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId={`${fieldKey}.suburb`}>
              <Form.Label>{getSuburbLabel(country)}</Form.Label>
              <TextInput field={`${fieldKey}.suburb`} />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group controlId={`${fieldKey}.state`}>
              <Form.Label>{getStateLabel(country)}</Form.Label>
              <StateInput field={`${fieldKey}.state`} country={country} />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId={`${fieldKey}.postcode`}>
              <Form.Label>{getPostcodeLabel(country)}</Form.Label>
              <PostcodeInput field={`${fieldKey}.postcode`} country={country} />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderCountryField(field, fieldKey) {
    const { settings, defaultCountry } = this.props;

    if (settings.hideCountry) {
      return (
        <FormElement
          field={`${fieldKey}.country`}
          value={defaultCountry}
        />
      );
    }

    return (
      <Form.Row>
        <Col>
          <Form.Group controlId="country">
            <Form.Label>{t('country', 'Country')}</Form.Label>
            <CountryInput
              field={`${fieldKey}.country`}
              initialValue={defaultCountry}
              region={settings.region}
            />
          </Form.Group>
        </Col>
      </Form.Row>
    );
  }

  renderTitleField(field, fieldKey) {
    return (
      <div key={fieldKey} className="field field--title">
        {field.question || field.label}

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </div>
    );
  }

  renderHiddenField(field, fieldKey) {
    return (
      <FormElement
        key={fieldKey}
        field={fieldKey}
        value={field.defaultValue}
      />
    );
  }

  getSubmitBtnText() {
    const { settings, section, isLastSection } = this.props;

    if (section === undefined || isLastSection) {
      if (settings.submitBtnText) {
        return settings.submitBtnText;
      }

      return t('submit', 'Submit');
    }

    if (settings.nextBtnText) {
      return settings.nextBtnText;
    }

    return t('next', 'Next');
  }

  renderFooter() {
    const { layout, isBusy, settings, index, section } = this.props;

    if (index === 0 || section === undefined) {
      return (
        <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
          <Form.Row className="justify-content-center">
            <Col>
              <SubmitButton
                title={this.getSubmitBtnText()}
                block
              />
            </Col>
          </Form.Row>
        </PanelFooter>
      );
    }

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          <Col xs={6}>
            {index !== 0 &&
              <BackButton
                title={settings.backBtnText || t('back', 'Back')}
                onClick={this.onPressBack}
                block
              />
            }
          </Col>
          <Col xs={6}>
            <SubmitButton
              title={this.getSubmitBtnText()}
              block
            />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="case-form-panel">
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
