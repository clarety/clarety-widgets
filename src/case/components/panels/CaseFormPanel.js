import React from 'react';
import memoize from 'memoize-one';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { getLanguage, t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { requiredField, emailField, getSuburbLabel, getStateLabel, getPostcodeLabel, moveInArray } from 'shared/utils';
import { TextInput, TextAreaInput, EmailInput, PhoneInput, NumberInput, CurrencyInput, CheckboxInput, CheckboxesInput, SelectInput, RadioInput, DateInput, StateInput, CountryInput, PostcodeInput, FileUploadInput, RatingInput, RankingInput, FormElement, SubmitButton, BackButton, ErrorMessages } from 'form/components';

export class CaseFormPanel extends BasePanel {
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

  onPressSave = async (event) => {
    const didSave = await this.props.onSave();

    if (didSave) {
      alert(t('case-form-saved', 'Your progress has been saved. Return to this page at any time to continue.'));
    } else {
      alert('An error occured, please correct the invalid fields and try again');
    }
  };

  isBusiness() {
    return this.props.formData['customer.type'] === '1';
  }

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
        const field = this.getFieldForElement(element);
        const fieldType = this.getFieldType(field, fieldKey);

        if (fieldType === 'address') {
          requiredField(errors, formData, `${fieldKey}.address1`);
          requiredField(errors, formData, `${fieldKey}.suburb`);
          requiredField(errors, formData, `${fieldKey}.state`);
          requiredField(errors, formData, `${fieldKey}.postcode`);
          requiredField(errors, formData, `${fieldKey}.country`);
        } else if (fieldType === 'country') {
          requiredField(errors, formData, `${fieldKey}.country`);
        } else if (fieldType === 'country-postcode') {
          requiredField(errors, formData, `${fieldKey}.postcode`);
          requiredField(errors, formData, `${fieldKey}.country`);
        } else if (fieldType === 'country-state-postcode') {
          requiredField(errors, formData, `${fieldKey}.state`);
          requiredField(errors, formData, `${fieldKey}.postcode`);
          requiredField(errors, formData, `${fieldKey}.country`);
        } else {
          requiredField(errors, formData, fieldKey);
        }
      }
    }

    // Validate email.
    if (formData['customer.email']) {
      emailField(errors, formData, 'customer.email');
    }

    // Validate business name.
    if (this.isBusiness()) {
      requiredField(errors, formData, 'customer.businessName');
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

  getFieldForElement(element) {
    const field = {
      columnKey: element.property,
      type:      element.additional.inputType,
      label:     element.additional.label,
      required:  element.required,
      options:   element.options,
    };

    // Check for customer type field.
    if (field.columnKey === 'type') {
      field.type = 'customertype';
    }

    return field;
  }

  getFieldType(field, fieldKey) {
    // Field type can be overridden via fieldTypes prop.
    // ie: use a country input for billingid instead of an address.
    return this.props.fieldTypes[fieldKey] || field.type;
  }

  getFieldLabel(field, fieldKey) {
    return t(`${fieldKey}.label`, field.question || field.label);
  }

  getInitialValue(fieldKey) {
    const { initialValues = {} } = this.props.settings;
    return initialValues[fieldKey];
  }

  shouldShowConditionalField(field) {
    const value = this.props.formData[`extendFields.${field.conditionalField}`];

    return Array.isArray(value)
      ? value.includes(field.conditionalValue)
      : value == field.conditionalValue;
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

    const elements = this.reorderCustomerElements(customerElement.elements);

    return (
      <div>
        <div className="form-header">
          <h2 className="title">{t('your-details', 'Your Details')}</h2>
        </div>

        <div className="form-fields">
          {elements.map(element => this.renderCustomerElement(element))}
        </div>

        <FormElement
          field="customer.language"
          value={getLanguage()}
        />
      </div>
    );
  }

  reorderCustomerElements = memoize((elements) => {
    const { reorderCustomerFields } = this.props.settings;

    if (!reorderCustomerFields) return elements;

    const newElements = elements.slice();

    for (const { move, before, after } of reorderCustomerFields) {
      const fromIndex = newElements.findIndex(el => move === `customer.${el.property}`);
      
      let toIndex = -1;
      if (before) toIndex = newElements.findIndex(el => before === `customer.${el.property}`);
      if (after)  toIndex = newElements.findIndex(el => after  === `customer.${el.property}`);

      if (fromIndex !== -1 && toIndex !== -1) {
        if (before) moveInArray(newElements, fromIndex, toIndex);
        if (after)  moveInArray(newElements, fromIndex, toIndex + 1);
      }
    }

    return newElements;
  });

  renderCustomerElement(element) {
    const field = this.getFieldForElement(element);
    return this.renderField(field, 'customer');
  }

  renderExtendForm(section = null) {
    const form = section !== null
      ? this.props.form.sections[section]
      : this.props.form;

    if (!form) return null;

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

  renderField(field, resourceKey = null) {
    const fieldKey = resourceKey ? resourceKey + '.' + field.columnKey : field.columnKey;

    // Ignore fields that aren't in the 'shown fields' list.
    if (!this.props.shownFields.includes(fieldKey)) return null;

    // Ignore conditional fields that don't meet their condition.
    if (field.conditionalField && !this.shouldShowConditionalField(field)) return null;

    switch (this.getFieldType(field, fieldKey)) {
      case 'text':         return this.renderTextField(field, fieldKey);
      case 'textarea':     return this.renderTextAreaField(field, fieldKey);
      case 'email':        return this.renderEmailField(field, fieldKey);
      case 'phonenumber':  return this.renderPhoneField(field, fieldKey);
      case 'number':       return this.renderNumberField(field, fieldKey);
      case 'currency':     return this.renderCurrencyField(field, fieldKey);
      case 'checkbox':     return this.renderCheckboxField(field, fieldKey);
      case 'checkboxs':    return this.renderCheckboxesField(field, fieldKey);
      case 'select':       return this.renderSelectField(field, fieldKey);
      case 'radio':        return this.renderRadioField(field, fieldKey);
      case 'date':         return this.renderDateField(field, fieldKey);
      case 'fileupload':   return this.renderFileUploadField(field, fieldKey);
      case 'title':        return this.renderTitleField(field, fieldKey);
      case 'hidden':       return this.renderHiddenField(field, fieldKey);
      case 'customertype': return this.renderCustomerTypeField(field, fieldKey);
      case 'rating':       return this.renderRatingField(field, fieldKey);
      case 'ranking':      return this.renderRankingField(field, fieldKey);
      case 'acceptterms':  return this.renderAcceptTermsField(field, fieldKey);

      // Address fields.
      case 'address': return this.renderAddressField(field, fieldKey);
      case 'country': return this.renderCountryField(field, fieldKey);
      case 'country-postcode': return this.renderCountryPostcodeField(field, fieldKey);
      case 'country-state-postcode': return this.renderCountryStatePostcodeField(field, fieldKey);
    }

    console.warn(`renderField not implemented for type: ${field.type}`);
    return null;
  }

  renderLabel(field, fieldKey) {
    const label = this.getFieldLabel(field, fieldKey);
    return <label dangerouslySetInnerHTML={{ __html: label }} />;
  }

  renderExplanation(field) {
    if (!field.explanation) return null;

    return (
      <div
        className="explanation"
        dangerouslySetInnerHTML={{ __html: field.explanation }}
      />
    );
  }

  renderTextField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--text">
        {this.renderLabel(field, fieldKey)}

        <TextInput
          field={fieldKey}
          required={field.required}
          initialValue={this.getInitialValue(fieldKey)}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderTextAreaField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--textarea">
        {this.renderLabel(field, fieldKey)}

        <TextAreaInput
          field={fieldKey}
          required={field.required}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderEmailField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--email">
        {this.renderLabel(field, fieldKey)}

        <EmailInput
          field={fieldKey}
          required={field.required}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderPhoneField(field, fieldKey) {
    const { settings } = this.props;

    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--phone">
        {this.renderLabel(field, fieldKey)}

        <PhoneInput
          field={fieldKey}
          required={field.required}
          showCountrySelect={settings.showPhoneCountrySelect}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderNumberField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--number">
        {this.renderLabel(field, fieldKey)}

        <NumberInput
          field={fieldKey}
          required={field.required}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderCurrencyField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--currency">
        {this.renderLabel(field, fieldKey)}

        <CurrencyInput
          field={fieldKey}
          required={field.required}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderCheckboxField(field, fieldKey) {
    return (
      <div key={fieldKey} className="field field--checkbox">
        <CheckboxInput
          field={fieldKey}
          label={this.getFieldLabel(field, fieldKey)}
          required={field.required}
          initialValue={this.getInitialValue(fieldKey)}
        />

        {this.renderExplanation(field)}
      </div>
    );
  }

  renderCheckboxesField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--checkboxes">
        {this.renderLabel(field, fieldKey)}

        <CheckboxesInput
          field={fieldKey}
          options={field.options}
          required={field.required}
          initialValue={this.getInitialValue(fieldKey)}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderSelectField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--select">
        {this.renderLabel(field, fieldKey)}

        <SelectInput
          field={fieldKey}
          options={field.options}
          required={field.required}
          initialValue={this.getInitialValue(fieldKey)}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderRadioField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--radio">
        {this.renderLabel(field, fieldKey)}

        <RadioInput
          field={fieldKey}
          options={field.options}
          required={field.required}
          initialValue={this.getInitialValue(fieldKey)}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderDateField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--date">
        {this.renderLabel(field, fieldKey)}

        <DateInput
          field={fieldKey}
          required={field.required}
          initialValue={this.getInitialValue(fieldKey)}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderFileUploadField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--fileupload">
        {this.renderLabel(field, fieldKey)}

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

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderAddressField(field, fieldKey) {
    const { settings, defaultCountry } = this.props;
    const country = this.props.formData[`${fieldKey}.country`];

    return (
      <div key={fieldKey} className="field field--address">
        {settings.hideCountry
          ? <FormElement
              key={fieldKey}
              field={`${fieldKey}.country`}
              value={defaultCountry}
            />
          : <Form.Row key={fieldKey}>
              <Col>
                <CountryField
                  fieldKey={fieldKey}
                  region={settings.region}
                  defaultCountry={defaultCountry}
                />
              </Col>
            </Form.Row>
        }

        <Form.Row>
          <Col sm>
            <Address1Field fieldKey={fieldKey} country={country} />
          </Col>
          <Col sm>
            <SuburbField fieldKey={fieldKey} country={country} />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <StateField fieldKey={fieldKey} country={country} />
          </Col>
          <Col sm>
            <PostcodeField fieldKey={fieldKey} country={country} />
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderCountryPostcodeField(field, fieldKey) {
    const { settings, defaultCountry } = this.props;
    const country = this.props.formData[`${fieldKey}.country`];

    return (
      <div key={fieldKey} className="field field--country-postcode">
        <Form.Row>
          <Col sm>
            <CountryField
              fieldKey={fieldKey}
              region={settings.region}
              defaultCountry={defaultCountry}
            />
          </Col>
          <Col sm>
            <PostcodeField fieldKey={fieldKey} country={country} />
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderCountryStatePostcodeField(field, fieldKey) {
    const { settings, defaultCountry } = this.props;
    const country = this.props.formData[`${fieldKey}.country`];

    return (
      <div key={fieldKey} className="field field--country-state-postcode">
        <Form.Row key={fieldKey}>
          <Col>
            <CountryField
              fieldKey={fieldKey}
              region={settings.region}
              defaultCountry={defaultCountry}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <StateField fieldKey={fieldKey} country={country} />
          </Col>
          <Col sm>
            <PostcodeField fieldKey={fieldKey} country={country} />
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderCountryField(field, fieldKey) {
    const { settings, defaultCountry } = this.props;

    return (
      <Form.Row key={fieldKey}>
        <Col>
          <CountryField
            fieldKey={fieldKey}
            region={settings.region}
            defaultCountry={defaultCountry}
          />
        </Col>
      </Form.Row>
    );
  }

  renderTitleField(field, fieldKey) {
    return (
      <div key={fieldKey} className="field field--title">
        <h2 className="title">{field.question || field.label}</h2>

        {this.renderExplanation(field)}
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

  renderCustomerTypeField(field, fieldKey) {
    const businessNameField = {
      columnKey: 'businessName',
      type:      'text',
      label:     'Business Name',
      required:  true,
    };

    return (
      <React.Fragment key={fieldKey}>
        {this.renderSelectField(field, fieldKey)}
        {this.isBusiness() &&
          this.renderTextField(businessNameField, 'customer.businessName')
        }
      </React.Fragment>
    );
  }

  renderRatingField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--rating">
        {this.renderLabel(field, fieldKey)}

        <RatingInput
          field={fieldKey}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderRankingField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--ranking">
        {this.renderLabel(field, fieldKey)}

        <RankingInput
          field={fieldKey}
          options={field.options}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderAcceptTermsField(field, fieldKey) {
    return (
      <div key={fieldKey} className="field field--acceptterms">
        <div
          className="terms-html"
          dangerouslySetInnerHTML={{ __html: field.html }}
        />

        {this.renderCheckboxField(field, fieldKey)}
      </div>
    );
  }

  renderFooter() {
    const { layout, isBusy, showSaveBtn } = this.props;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          {this.renderFooterBtns()}
        </Form.Row>

        {showSaveBtn && this.renderSaveBtn()}
      </PanelFooter>
    );
  }

  renderSaveBtn() {
    const { isBusy, isBusySave } = this.props;

    return (
      <div className="save-btn-container">
        <Button
          onClick={this.onPressSave}
          disabled={isBusy || isBusySave}
          className="btn-save"
          variant="link"
        >
          {isBusySave
            ? <Spinner animation="border" size="sm" />
            : this.getSaveBtnText()
          }
        </Button>
      </div>
    );
  }

  getSaveBtnText() {
    const { settings } = this.props;

    if (settings.saveBtnText) {
      return settings.saveBtnText;
    }

    return t('save', 'Save');
  }

  renderFooterBtns() {
    const { settings, index, section, isBusySave } = this.props;

    if (index === 0 || section === undefined) {
      return (
        <Col>
          <SubmitButton
            title={this.getSubmitBtnText()}
            isDisabled={isBusySave}
            block
          />
        </Col>
      );
    }

    return (
      <React.Fragment>
        <Col xs={6}>
          {index !== 0 &&
            <BackButton
              title={settings.backBtnText || t('back', 'Back')}
              onClick={this.onPressBack}
              isDisabled={isBusySave}
              block
            />
          }
        </Col>
        <Col xs={6}>
          <SubmitButton
            title={this.getSubmitBtnText()}
            isDisabled={isBusySave}
            block
          />
        </Col>
      </React.Fragment>
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

function Address1Field({ fieldKey }) {
  return (
    <Form.Group controlId={`${fieldKey}.address1`}>
      <Form.Label>{t('street', 'Street')}</Form.Label>
      <TextInput field={`${fieldKey}.address1`} type="street" />
    </Form.Group>
  );
}

function SuburbField({ fieldKey, country }) {
  return (
    <Form.Group controlId={`${fieldKey}.suburb`}>
      <Form.Label>{getSuburbLabel(country)}</Form.Label>
      <TextInput field={`${fieldKey}.suburb`} />
    </Form.Group>
  );
}

function StateField({ fieldKey, country }) {
  return (
    <Form.Group controlId={`${fieldKey}.state`}>
      <Form.Label>{getStateLabel(country)}</Form.Label>
      <StateInput field={`${fieldKey}.state`} country={country} />
    </Form.Group>
  );
}

function PostcodeField({ fieldKey, country }) {
  return (
    <Form.Group controlId={`${fieldKey}.postcode`}>
      <Form.Label>{getPostcodeLabel(country)}</Form.Label>
      <PostcodeInput field={`${fieldKey}.postcode`} country={country} />
    </Form.Group>
  );
}

function CountryField({ fieldKey, region, defaultCountry }) {
  return (
    <Form.Group controlId="country">
      <Form.Label>{t('country', 'Country')}</Form.Label>
      <CountryInput
        field={`${fieldKey}.country`}
        initialValue={defaultCountry}
        region={region}
      />
    </Form.Group>
  );
}
