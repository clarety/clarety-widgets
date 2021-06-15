import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { requiredField, emailField, getSuburbLabel, getStateLabel, getPostcodeLabel } from 'shared/utils';
import { TextInput, TextAreaInput, EmailInput, PhoneInput, NumberInput, CurrencyInput, CheckboxInput, CheckboxesInput, SelectInput, RadioInput, DateInput, StateInput, CountryInput, PostcodeInput, FormElement, SubmitButton, BackButton, ErrorMessages } from 'form/components';

export class CaseFormPanel extends BasePanel {
  onShowPanel() {

  }

  onPressBack = (event) => {
    event.preventDefault();

    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel } = this.props;

    const isValid = this.validate();
    if (!isValid) return;
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    // nextPanel();
  };

  validate() {
    const errors = [];
    this.validateFields(errors);
    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    
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
      <form onSubmit={this.onPressNext} data-testid="case-form-panel">
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
          {this.renderCustomerForm()}
          {this.renderExtendForm()}
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

  renderCustomerForm() {
    const { customerElement } = this.props;
    if (!customerElement) return null;

    return (
      <div>
        {customerElement.elements.map(this.renderElement)}
      </div>
    );
  }

  renderExtendForm() {
    return (
      <div>
        {this.props.form.extendFields.map(field => this.renderField(field, 'extendFields'))}
      </div>
    );
  }

  renderField(field, resourceKey = null) {
    const fieldKey = resourceKey ? resourceKey + '.' + field.columnKey : field.columnKey;

    switch (field.type) {
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
      case 'imageupload': return this.renderImageUploadField(field, fieldKey);
      case 'address':     return this.renderAddressField(field, fieldKey);
      case 'title':       return this.renderTitleField(field, fieldKey);
      case 'hidden':      return this.renderHiddenField(field, fieldKey);
    }

    console.warn(`renderField not implemented for type: ${field.type}`);
    return null;
  }

  renderElement = (element) => {
    // TODO: translate input label

    const field = {
      columnKey: element.property,
      type:      element.input.type,
      label:     element.input.label,
      required:  element.required,
      options:   element.options,
    };

    return this.renderField(field, 'customer');
  };

  renderTextField(field, fieldKey) {
    return (
      <Form.Group controlId={fieldKey} key={fieldKey} className="field field--text">
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
        <Form.Label>{field.question || field.label}</Form.Label>

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
    // TODO:
    return (
      <div key={fieldKey}>TODO: File Upload</div>
    );
  }

  renderImageUploadField(field, fieldKey) {
    // TODO:
    return (
      <div key={fieldKey}>TODO: Image Upload</div>
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

  renderFooter() {
    const { layout, isBusy, settings } = this.props;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          <Col xs={6}>
            <BackButton
              title={settings.backBtnText || t('back', 'Back')}
              onClick={this.onPressBack}
              block
            />
          </Col>
          <Col xs={6}>
            <SubmitButton
              title={settings.submitBtnText || t('next', 'Next')}
              testId="next-button"
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
