import React from 'react';
import memoize from 'memoize-one';
import { Form, Row, Col, Button, Spinner, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
import { getLanguage, t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter, AddressFinder } from 'shared/components';
import { requiredField, emailField, addressField, getSuburbLabel, getStateLabel, getPostcodeLabel, moveInArray, scrollIntoView } from 'shared/utils';
import { TextInput, TextAreaInput, EmailInput, PhoneInput, NumberInput, CurrencyInput, CheckboxInput, CheckboxesInput, SelectInput, RadioInput, DateInput, StateInput, CountryInput, PostcodeInput, FileUploadInput, RatingInput, RankingInput, FormElement, SubmitButton, BackButton, ErrorMessages } from 'form/components';

export class CaseFormPanel extends BasePanel {
  fieldRefs = [];

  state = {
    disableAddressFinders: false,
    subformCounts: {},
  };

  componentDidMount() {
    this.initSubformCounts();
  }

  initSubformCounts() {
    const { section, formData } = this.props;

    if (section !== 'customer') {
      const form = section !== undefined
        ? this.props.form.sections[section]
        : this.props.form;
      
      for (const field of form.extendFields) {
        if (field.type === 'subform') {
          let repeats = field.minRepeats || 0;

          // Check existing form data for this subform
          const subformKey = 'extendFields.' + field.columnKey;
          for (const key in formData) {
            if (key.startsWith(subformKey)) {
              // Make sure we have enough repeats for this index.
              const index = parseInt(key.split('.')[2]);
              if (!Number.isNaN(index)) {
                repeats = Math.max(repeats, index + 1);
              }
            }
          }

          this.setState(prev => ({
            subformCounts: {
              ...prev.subformCounts,
              [subformKey]: repeats,
            }
          }));
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (prevProps.errors !== this.props.errors) {
      this.scrollToFirstError(this.props.errors);
    }
  }

  onPressBack = (event) => {
    event.preventDefault();
    this.props.prevPanel();
    this.scrollIntoView();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, section, isLastSection, isPreview } = this.props;
    const shouldSubmit = section === undefined || isLastSection;

    if (isPreview) {
      if (shouldSubmit) return;
      return nextPanel();
    }

    const isValid = this.validate();
    if (!isValid) return;

    if (shouldSubmit) {
      const didSubmit = await onSubmit();
      if (!didSubmit) return;
    }

    nextPanel();
    this.scrollIntoView();
    this.setState({ disableAddressFinders: true });
  };

  onPressSave = async (event) => {
    const didSave = await this.props.onSave();

    if (!didSave) {
      alert('An error occured, please correct the invalid fields and try again');
    }
  };

  scrollToFirstError(errors) {
    const error = errors[0] || null;
    if (error) {
      if (error.field) {
        const ref = this.fieldRefs[error.field];
        if (ref) scrollIntoView(ref);
      } else {
        scrollIntoView(this);
      }
    }
  }

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
      if(element.property === 'optIn'){
        //customer.optIn is always on the last panel and is validated then, ignore it.
        continue;
      }

      const fieldKey = `customer.${element.property}`;
      if (requiredFields.includes(fieldKey)) {
        const field = this.getFieldForElement(element);
        const fieldType = this.getFieldType(field, fieldKey);

        if (fieldType === 'address') {
          addressField(errors, formData, fieldKey);
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
    const { requiredFields, formData, isLastSection } = this.props;

    const form = section !== null
      ? this.props.form.sections[section]
      : this.props.form;

    for (const field of form.extendFields) {
      // Skip hidden conditional fields.
      if (field.conditionalField && !this.shouldShowConditionalField(field)) {
        continue;
      }

      const fieldKey = `extendFields.${field.columnKey}`;
      const fieldType = this.getFieldType(field, fieldKey);

      if (fieldType === 'subform') {
        this.validateSubform(errors, field, fieldKey);
      } else if (requiredFields.includes(fieldKey)) {
        if (fieldType === 'address') {
          addressField(errors, formData, fieldKey);
        } else {
          requiredField(errors, formData, fieldKey);
        }
      }
    }

    //Validate if the opt-in checkbox is required
    if ((section === null || isLastSection) && requiredFields.includes('customer.optIn')) {
      requiredField(errors, formData, 'customer.optIn');
    }
  }

  validateSubform(errors, subform, fieldKey) {
    const { requiredFields, formData } = this.props;

    const subformCount = this.getSubformCount(this.state, subform, fieldKey);
    for (let i = 0; i < subformCount; i += 1) {
      for (const subfield of subform.extendFields) {
        const subfieldKey = `${fieldKey}.#.${subfield.columnKey}`;
        if (requiredFields.includes(subfieldKey)) {
          requiredField(errors, formData, subfieldKey.replace('#', i));
        }
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

  getFieldLabel(field, fieldKey, isRequired) {
    const label = t(`${fieldKey}.label`, field.question || field.label);
    return label + (isRequired ? ' *' : '');
  }

  getInitialValue(fieldKey) {
    const { initialValues = {} } = this.props.settings;
    return initialValues[fieldKey];
  }

  getCustomerSectionName() {
    return t('your-details', 'Your Details');
  }

  shouldShowConditionalField(field) {
    const value = this.props.formData[`extendFields.${field.conditionalField}`];

    return Array.isArray(value)
      ? value.includes(field.conditionalValue)
      : value == field.conditionalValue;
  }

  shouldShowSectionSidebar() {
    return this.props.sectionNavStyle === 'sidebar';
  }

  getSubformCount(state, subform, fieldKey) {
    return state.subformCounts[fieldKey] || Number(subform.minRepeats || 0);
  }

  addSubform(subform, fieldKey) {
    this.setState(prev => ({
      subformCounts: {
        ...prev.subformCounts,
        [fieldKey]: this.getSubformCount(prev, subform, fieldKey) + 1,
      }
    }));
  }

  removeSubform(subform, fieldKey) {
    const { formData, setFormData } = this.props;

    // Clear subform data.
    const index = this.getSubformCount(this.state, subform, fieldKey) - 1;
    const subformKey = `${fieldKey}.${index}.`;
    const clearedFields = {};
    for (const key in formData) {
      if (key.startsWith(subformKey)) {
        clearedFields[key] = undefined;
      }
    }
    setFormData(clearedFields);

    this.setState(prev => ({
      subformCounts: {
        ...prev.subformCounts,
        [fieldKey]: this.getSubformCount(prev, subform, fieldKey) - 1,
      }
    }));
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
          {this.shouldShowSectionSidebar()
            ?
              <Row>
                <Col lg={3}>
                  {this.renderSectionSidebar()}
                </Col>

                <Col lg={9}>
                  {this.renderErrorMessages()}
                  {this.renderForm()}  
                </Col>
              </Row>
            :
              <React.Fragment>
                {this.renderErrorMessages()}
                {this.renderForm()}
              </React.Fragment>
          }
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

  renderSectionSidebar() {
    const { form } = this.props;
    const currentSection = this.props.section;

    const currentSectionName
      = currentSection === undefined ? ''
      : currentSection === 'customer' ? "1. " + this.getCustomerSectionName()
      : (currentSection + 2) + ". " + form.sections[currentSection].name;

    return (
      <React.Fragment>
        {/* Dropdown for small devices */}
        <div className="section-dropdown d-lg-none">
          <Dropdown>
            <Dropdown.Toggle>
              {currentSectionName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => this.props.jumpToPanelForSection('customer')}
                disabled={currentSection === 'customer'}
                className={currentSection === 'customer' ? 'active' : undefined}
              >
                1. {this.getCustomerSectionName()}
              </Dropdown.Item>

              {form.sections.map((section, index) =>
                <Dropdown.Item
                  key={index}
                  onClick={() => this.props.jumpToPanelForSection(index)}
                  disabled={currentSection === 'customer' || currentSection <= index}
                  className={currentSection === index ? 'active' : undefined}
                >
                  {index + 2}. {section.name}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Sidebar for large devices */}
        <div className="section-sidebar d-none d-lg-flex">
          <Button
            variant="link"
            onClick={() => this.props.jumpToPanelForSection('customer')}
            disabled={currentSection === 'customer'}
            className={currentSection === 'customer' ? 'active' : undefined}
          >
            {currentSection === 'customer'
              ? <FontAwesomeIcon icon={faArrowRight} className="icon" />
              : <FontAwesomeIcon icon={faCheck} className="icon" />
            }
            1. {this.getCustomerSectionName()}
          </Button>

          {form.sections.map((section, index) =>
            <Button
              key={index}
              variant="link"
              onClick={() => this.props.jumpToPanelForSection(index)}
              disabled={currentSection === 'customer' || currentSection <= index}
              className={currentSection === index ? 'active' : undefined}
            >
              {currentSection === index
                ? <FontAwesomeIcon icon={faArrowRight} className="icon" />
                : currentSection === 'customer' || currentSection < index
                ? <span className="icon">&bull;</span>
                : <FontAwesomeIcon icon={faCheck} className="icon" />
              }
              {index + 2}. {section.name}
            </Button>
          )}
        </div>
      </React.Fragment>
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

    const hasSections = this.props.section !== undefined;
    const elements = this.reorderCustomerElements(customerElement.elements);

    return (
      <div>
        {hasSections &&
          <div className="form-header">
            <h2 className="title">{this.getCustomerSectionName()}</h2>
          </div>
        }

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

          {this.renderOptIn(section)}

        </div>
      </div>
    );
  }

  renderOptIn(section) {
    const { shownFields, requiredFields, settings, isLastSection, customerElement } = this.props;

    let fieldKey = 'customer.optIn';

    let shouldShowOptIn = ((section === null || isLastSection) && shownFields.includes(fieldKey));
    if (!shouldShowOptIn) return null;

    let label = '';
    if(settings.optInText){
      label = settings.optInText + (requiredFields.includes(fieldKey) ? ' *' : '');
    }else{
      const element = customerElement.elements.find(el => el.property === 'optIn');
      const field = this.getFieldForElement(element);
      label = this.getFieldLabel(field, fieldKey, false);
    }

    return (
        <div className="field field--checkbox" ref={ref => this.fieldRefs[fieldKey] = ref}>
          <CheckboxInput
              field={fieldKey}
              label={label}
              initialValue={!!settings.preTickOptIn}
          />
        </div>
    );
  }

  renderField(field, resourceKey = null, subformIndex = null) {
    const { shownFields, requiredFields, fetchedCustomer, settings } = this.props;

    let fieldKey = resourceKey ? resourceKey + '.' + field.columnKey : field.columnKey;

    // Ignore fields that aren't in the 'shown fields' list.
    if (!shownFields.includes(fieldKey)) return null;

    // Ignore conditional fields that don't meet their condition.
    if (field.conditionalField && !this.shouldShowConditionalField(field)) return null;

    const isRequired = requiredFields.includes(fieldKey);
    const isDisabled = fetchedCustomer && (settings.disableIfPrefilled || []).includes(fieldKey);

    // Subform fields only: Update field key with subform index. 
    if (subformIndex !== null) fieldKey = fieldKey.replace('#', subformIndex);

    switch (this.getFieldType(field, fieldKey)) {
      case 'text':         return this.renderTextField({ field, fieldKey, isRequired, isDisabled });
      case 'textarea':     return this.renderTextAreaField({ field, fieldKey, isRequired, isDisabled });
      case 'email':        return this.renderEmailField({ field, fieldKey, isRequired, isDisabled });
      case 'phonenumber':  return this.renderPhoneField({ field, fieldKey, isRequired, isDisabled });
      case 'number':       return this.renderNumberField({ field, fieldKey, isRequired, isDisabled });
      case 'currency':     return this.renderCurrencyField({ field, fieldKey, isRequired, isDisabled });
      case 'checkbox':     return this.renderCheckboxField({ field, fieldKey, isRequired, isDisabled });
      case 'checkboxs':    return this.renderCheckboxesField({ field, fieldKey, isRequired, isDisabled });
      case 'select':       return this.renderSelectField({ field, fieldKey, isRequired, isDisabled });
      case 'radio':        return this.renderRadioField({ field, fieldKey, isRequired, isDisabled });
      case 'date':         return this.renderDateField({ field, fieldKey, isRequired, isDisabled });
      case 'fileupload':   return this.renderFileUploadField({ field, fieldKey, isRequired, isDisabled });
      case 'title':        return this.renderTitleField({ field, fieldKey, isRequired, isDisabled });
      case 'contentblock': return this.renderContentBlockField({ field, fieldKey, isRequired, isDisabled });
      case 'hidden':       return this.renderHiddenField({ field, fieldKey, isRequired, isDisabled });
      case 'customertype': return this.renderCustomerTypeField({ field, fieldKey, isRequired, isDisabled });
      case 'rating':       return this.renderRatingField({ field, fieldKey, isRequired, isDisabled });
      case 'ranking':      return this.renderRankingField({ field, fieldKey, isRequired, isDisabled });
      case 'acceptterms':  return this.renderAcceptTermsField({ field, fieldKey, isRequired, isDisabled });
      case 'subform':      return this.renderSubform({ field, fieldKey, isRequired, isDisabled });

      // Address fields.
      case 'address': return this.renderAddressField({ field, fieldKey, isRequired, isDisabled });
      case 'country': return this.renderCountryField({ field, fieldKey, isRequired, isDisabled });
      case 'country-postcode': return this.renderCountryPostcodeField({ field, fieldKey, isRequired, isDisabled });
      case 'country-state-postcode': return this.renderCountryStatePostcodeField({ field, fieldKey, isRequired, isDisabled });
    }

    console.warn(`renderField not implemented for type: ${field.type}`);
    return null;
  }

  renderLabel(field, fieldKey, isRequired) {
    const label = this.getFieldLabel(field, fieldKey, isRequired);
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

  renderTextField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--text" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <TextInput
          field={fieldKey}
          initialValue={this.getInitialValue(fieldKey)}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderTextAreaField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className={`field field--textarea size-${field.size}`} ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <TextAreaInput
          field={fieldKey}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderEmailField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--email" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <EmailInput
          field={fieldKey}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderPhoneField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    const { settings } = this.props;

    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--phone" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <PhoneInput
          field={fieldKey}
          required={isRequired}
          disabled={isDisabled}
          showCountrySelect={settings.showPhoneCountrySelect}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderNumberField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--number" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <NumberInput
          field={fieldKey}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderCurrencyField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--currency" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <CurrencyInput
          field={fieldKey}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderCheckboxField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <div key={fieldKey} className="field field--checkbox" ref={ref => this.fieldRefs[fieldKey] = ref}>
        <CheckboxInput
          field={fieldKey}
          label={this.getFieldLabel(field, fieldKey, isRequired)}
          initialValue={this.getInitialValue(fieldKey)}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </div>
    );
  }

  renderCheckboxesField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--checkboxes" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <CheckboxesInput
          field={fieldKey}
          options={field.options}
          initialValue={this.getInitialValue(fieldKey)}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderSelectField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--select" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <SelectInput
          field={fieldKey}
          options={field.options}
          initialValue={this.getInitialValue(fieldKey)}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderRadioField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--radio" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <RadioInput
          field={fieldKey}
          options={field.options}
          initialValue={this.getInitialValue(fieldKey)}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderDateField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--date" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <DateInput
          field={fieldKey}
          initialValue={this.getInitialValue(fieldKey)}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderFileUploadField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--fileupload" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <FileUploadInput
          field={fieldKey}
          maxFiles={field.maxFiles}
          maxFileSize={field.maxFileSize}
          acceptedFileTypes={field.fileTypes}
          required={isRequired}
          disabled={isDisabled}
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

  renderAddressField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    const { settings } = this.props;

    return (
      <div key={fieldKey} className="field field--address" ref={ref => this.fieldRefs[fieldKey] = ref}>
        <AddressField
          fieldKey={fieldKey}
          label={this.getFieldLabel(field, fieldKey)}
          addressFinderKey={this.props.addressFinderKey}
          addressFinderCountry={this.props.addressFinderCountry}
          disableAddressFinder={this.state.disableAddressFinders}
          hideCountry={settings.hideCountry}
          defaultCountry={this.props.defaultCountry}
          region={settings.region}
          formData={this.props.formData}
          setFormData={this.props.setFormData}
          required={isRequired}
          disabled={isDisabled}
        />
      </div>
    );
  }

  renderCountryPostcodeField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    const { settings, defaultCountry } = this.props;
    const country = this.props.formData[`${fieldKey}.country`];

    return (
      <div key={fieldKey} className="field field--country-postcode" ref={ref => this.fieldRefs[fieldKey] = ref}>
        <Form.Row>
          <Col sm>
            <CountryField
              fieldKey={fieldKey}
              region={settings.region}
              defaultCountry={defaultCountry}
              required={isRequired}
              disabled={isDisabled}
              labelPrefix={this.getFieldLabel(field, fieldKey)}
            />
          </Col>
          <Col sm>
            <PostcodeField
              fieldKey={fieldKey}
              country={country}
              required={isRequired}
              disabled={isDisabled}
              labelPrefix={this.getFieldLabel(field, fieldKey)}
            />
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderCountryStatePostcodeField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    const { settings, defaultCountry } = this.props;
    const country = this.props.formData[`${fieldKey}.country`];

    return (
      <div key={fieldKey} className="field field--country-state-postcode" ref={ref => this.fieldRefs[fieldKey] = ref}>
        <Form.Row key={fieldKey}>
          <Col>
            <CountryField
              fieldKey={fieldKey}
              region={settings.region}
              defaultCountry={defaultCountry}
              required={isRequired}
              disabled={isDisabled}
              labelPrefix={this.getFieldLabel(field, fieldKey)}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <StateField
              fieldKey={fieldKey}
              country={country}
              required={isRequired}
              disabled={isDisabled}
              labelPrefix={this.getFieldLabel(field, fieldKey)}
            />
          </Col>
          <Col sm>
            <PostcodeField
              fieldKey={fieldKey}
              country={country}
              required={isRequired}
              disabled={isDisabled}
              labelPrefix={this.getFieldLabel(field, fieldKey)}
            />
          </Col>
        </Form.Row>
      </div>
    );
  }

  renderCountryField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    const { settings, defaultCountry } = this.props;

    return (
      <Form.Row key={fieldKey} ref={ref => this.fieldRefs[fieldKey] = ref}>
        <Col>
          <CountryField
            fieldKey={fieldKey}
            region={settings.region}
            defaultCountry={defaultCountry}
            required={isRequired}
            disabled={isDisabled}
          />
        </Col>
      </Form.Row>
    );
  }

  renderTitleField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <div key={fieldKey} className="field field--title" ref={ref => this.fieldRefs[fieldKey] = ref}>
        <h2 className="title">{field.question || field.label}</h2>

        {this.renderExplanation(field)}
      </div>
    );
  }

  renderContentBlockField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <div
        key={fieldKey}
        className="field field--contentblock"
        ref={ref => this.fieldRefs[fieldKey] = ref}
        dangerouslySetInnerHTML={{ __html: field.html }}
      />
    );
  }

  renderHiddenField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <FormElement
        key={fieldKey}
        field={fieldKey}
        value={field.defaultValue}
      />
    );
  }

  renderCustomerTypeField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    const businessNameField = {
      columnKey: 'businessName',
      type:      'text',
      label:     'Business Name',
      required:  true,
    };

    return (
      <React.Fragment key={fieldKey}>
        {this.renderSelectField({ field, fieldKey, isRequired, isDisabled })}
        {this.isBusiness() &&
          this.renderTextField({ field: businessNameField, fieldKey: 'customer.businessName', isRequired: true, isDisabled })
        }
      </React.Fragment>
    );
  }

  renderRatingField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--rating" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <RatingInput
          field={fieldKey}
          required={isRequired}
          disabled={isDisabled}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderRankingField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--ranking" ref={ref => this.fieldRefs[fieldKey] = ref}>
        {this.renderLabel(field, fieldKey, isRequired)}

        <RankingInput
          field={fieldKey}
          options={field.options}
        />

        {this.renderExplanation(field)}
      </Form.Group>
    );
  }

  renderAcceptTermsField({ field, fieldKey, isRequired = false, isDisabled = false }) {
    return (
      <div key={fieldKey} className="field field--acceptterms" ref={ref => this.fieldRefs[fieldKey] = ref}>
        <div
          className="terms-html"
          dangerouslySetInnerHTML={{ __html: field.html }}
        />

        {this.renderCheckboxField({ field, fieldKey, isRequired, isDisabled })}
      </div>
    );
  }

  renderSubform({ field, fieldKey, isRequired = false, isDisabled = false }) {
    const subform = field;
    const subformCount = this.getSubformCount(this.state, subform, fieldKey);
    const canAdd = subformCount < subform.maxRepeats;
    const canRemove = subformCount > subform.minRepeats;

    const forms = [];
    for (let index = 0; index < subformCount; index += 1) {
      forms.push(
        <div key={index} className="subform-container">
          {subform.extendFields.map(field => this.renderField(field, fieldKey + '.#', index))}
        </div>
      );
    }

    return (
      <div key={fieldKey} className="field field--subform" ref={ref => this.fieldRefs[fieldKey] = ref}>
        <div className="subform-header">
          <div className="title">{subform.label}</div>
          <div className="explanation">{subform.explanation}</div>
        </div>

        {forms}

        <div className="subform-footer">
          {canAdd &&
            <Button size="sm" onClick={() => this.addSubform(subform, fieldKey)} style={{ marginRight: 10 }}>
              Add
            </Button>
          }

          {canRemove &&
            <Button size="sm" onClick={() => this.removeSubform(subform, fieldKey)}>
              Remove
            </Button>
          }
        </div>
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



class AddressField extends React.Component {
  state = {
    useAddressFinder: true,
  };

  componentDidMount() {
    const { disableAddressFinder } = this.props;
    if (disableAddressFinder) this.setState({ useAddressFinder: false });
  }

  componentDidUpdate(prevProps) {
    const { disableAddressFinder } = this.props;
    if (prevProps.disableAddressFinder !== disableAddressFinder && disableAddressFinder === true) {
      this.setState({ useAddressFinder: false });
    }
  }

  shouldUseAddressFinder() {
    const { addressFinderKey, addressFinderCountry, defaultCountry, formData, fieldKey } = this.props;
    
    if (addressFinderCountry) {
      if (formData[`${fieldKey}.country`] !== addressFinderCountry) {
        return false;
      }
    }

    // Don't use if we already have an address.
    if (formData[`${fieldKey}.address1`]) {
      return false;
    }

    return addressFinderKey && defaultCountry;
  }

  onAddressFinderSelect = (address) => {
    const { fieldKey } = this.props;

    this.props.setFormData({
      [`${fieldKey}.address1`]: address.address1,
      [`${fieldKey}.address2`]: address.address2,
      [`${fieldKey}.suburb`]:   address.suburb,
      [`${fieldKey}.state`]:    address.state,
      [`${fieldKey}.postcode`]: address.postcode,
      [`${fieldKey}.country`]:  address.country,
      [`${fieldKey}.dpid`]:     address.dpid,
    });
  };

  onPressDisableAddressFinder = () => this.setState({
    useAddressFinder: false,
  });

  render() {
    const { fieldKey, required, defaultCountry, label } = this.props;
    const country = this.props.formData[`${fieldKey}.country`];
    const useAddressFinder = this.state.useAddressFinder && this.shouldUseAddressFinder();

    return (
      <React.Fragment>
        {this.props.hideCountry
          ? <FormElement
              key={fieldKey}
              field={`${fieldKey}.country`}
              value={defaultCountry}
            />

          : <Form.Row key={fieldKey}>
              <Col>
                <CountryField
                  fieldKey={fieldKey}
                  region={this.props.region}
                  defaultCountry={defaultCountry}
                  required={required}
                  labelPrefix={label}
                />
              </Col>
            </Form.Row>
        }

        {useAddressFinder
          ? <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label htmlFor="address-finder-input">{t('address', 'Address')}</Form.Label>
                  <AddressFinder
                    id="address-finder-input"
                    apiKey={this.props.addressFinderKey}
                    country={this.props.addressFinderCountry}
                    onSelect={this.onAddressFinderSelect}
                  />

                  <Button variant="link" onClick={this.onPressDisableAddressFinder}>
                    {t('cant-find-your-address', "Can't find your address?")}
                  </Button>
                </Form.Group>
              </Col>
            </Form.Row>

          : <React.Fragment>
              <Form.Row>
                <Col sm>
                  <Address1Field
                    fieldKey={fieldKey}
                    country={country}
                    required={required}
                    labelPrefix={label}
                  />
                </Col>
                <Col sm>
                  <SuburbField
                    fieldKey={fieldKey}
                    country={country}
                    required={required && country !== 'NZ'}
                    labelPrefix={label}
                  />
                </Col>
              </Form.Row>
      
              <Form.Row>
                <Col sm>
                  <StateField
                    fieldKey={fieldKey}
                    country={country}
                    required={required}
                    labelPrefix={label}
                  />
                </Col>
                <Col sm>
                  <PostcodeField
                    fieldKey={fieldKey}
                    country={country}
                    required={required}
                    labelPrefix={label}
                  />
                </Col>
              </Form.Row>
            </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

function Address1Field({ fieldKey, required, labelPrefix }) {
  return (
    <Form.Group controlId={`${fieldKey}.address1`}>
      <Form.Label>{labelPrefix} {t('street', 'Street')}{required && ' *'}</Form.Label>
      <TextInput field={`${fieldKey}.address1`} type="street" />
    </Form.Group>
  );
}

function SuburbField({ fieldKey, country, required, labelPrefix }) {
  return (
    <Form.Group controlId={`${fieldKey}.suburb`}>
      <Form.Label>{labelPrefix} {getSuburbLabel(country)}{required && ' *'}</Form.Label>
      <TextInput field={`${fieldKey}.suburb`} />
    </Form.Group>
  );
}

function StateField({ fieldKey, country, required, labelPrefix }) {
  return (
    <Form.Group controlId={`${fieldKey}.state`}>
      <Form.Label>{labelPrefix} {getStateLabel(country)}{required && ' *'}</Form.Label>
      <StateInput field={`${fieldKey}.state`} country={country} />
    </Form.Group>
  );
}

function PostcodeField({ fieldKey, country, required, labelPrefix }) {
  return (
    <Form.Group controlId={`${fieldKey}.postcode`}>
      <Form.Label>{labelPrefix} {getPostcodeLabel(country)}{required && ' *'}</Form.Label>
      <PostcodeInput field={`${fieldKey}.postcode`} country={country} />
    </Form.Group>
  );
}

function CountryField({ fieldKey, region, defaultCountry, required, labelPrefix }) {
  return (
    <Form.Group controlId="country">
      <Form.Label>{labelPrefix} {t('country', 'Country')}{required && ' *'}</Form.Label>
      <CountryInput
        field={`${fieldKey}.country`}
        initialValue={defaultCountry}
        region={region}
      />
    </Form.Group>
  );
}
