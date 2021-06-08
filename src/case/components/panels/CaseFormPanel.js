import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { requiredField, emailField } from 'shared/utils';
import { TextInput, TextAreaInput, EmailInput, PhoneInput, NumberInput, CurrencyInput, CheckboxInput, CheckboxesInput, SelectInput, RadioInput, FormElement, SubmitButton, BackButton, ErrorMessages } from 'form/components';

export class CaseFormPanel extends BasePanel {
  onShowPanel() {

  }

  onPressBack = (event) => {
    event.preventDefault();

    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel, layout } = this.props;

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
    return (
      <div>
        {this.props.form.extendFields.map(this.renderField)}
      </div>
    );
  }

  renderField = (field) => {
    switch (field.type) {
      case 'text':        return this.renderTextField(field);
      case 'textarea':    return this.renderTextAreaField(field);
      case 'email':       return this.renderEmailField(field);
      case 'phonenumber': return this.renderPhoneField(field);
      case 'number':      return this.renderNumberField(field);
      case 'currency':    return this.renderCurrencyField(field);
      case 'checkbox':    return this.renderCheckboxField(field);
      case 'checkboxs':   return this.renderCheckboxesField(field);
      case 'select':      return this.renderSelectField(field);
      case 'radio':       return this.renderRadioField(field);
      case 'date':        return this.renderDateField(field);
      case 'fileupload':  return this.renderFileUploadField(field);
      case 'imageupload': return this.renderImageUploadField(field);
      case 'title':       return this.renderTitleField(field);
      case 'hidden':      return this.renderHiddenField(field);
    }

    console.warn(`renderField not implemented for type: ${field.type}`);
    return null;
  };

  renderTextField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--text">
        <Form.Label>{field.question || field.label}</Form.Label>

        <TextInput
          field={`extend.${field.columnKey}`}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderTextAreaField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--textarea">
        <Form.Label>{field.question || field.label}</Form.Label>

        <TextAreaInput
          field={`extend.${field.columnKey}`}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderEmailField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--email">
        <Form.Label>{field.question || field.label}</Form.Label>

        <EmailInput
          field={`extend.${field.columnKey}`}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderPhoneField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--phone">
        <Form.Label>{field.question || field.label}</Form.Label>

        <PhoneInput
          field={`extend.${field.columnKey}`}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderNumberField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--number">
        <Form.Label>{field.question || field.label}</Form.Label>

        <NumberInput
          field={`extend.${field.columnKey}`}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderCurrencyField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--currency">
        <Form.Label>{field.question || field.label}</Form.Label>

        <CurrencyInput
          field={`extend.${field.columnKey}`}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderCheckboxField(field) {
    return (
      <div key={field.columnKey} className="field field--checkbox">
        <CheckboxInput
          field={`extend.${field.columnKey}`}
          label={field.question || field.label}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </div>
    );
  }

  renderCheckboxesField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--checkboxes">
        <Form.Label>{field.question || field.label}</Form.Label>

        <CheckboxesInput
          field={`extend.${field.columnKey}`}
          options={field.options}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderSelectField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--select">
        <Form.Label>{field.question || field.label}</Form.Label>

        <SelectInput
          field={`extend.${field.columnKey}`}
          options={field.options}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderRadioField(field) {
    return (
      <Form.Group controlId={field.columnKey} key={field.columnKey} className="field field--radio">
        <Form.Label>{field.question || field.label}</Form.Label>

        <RadioInput
          field={`extend.${field.columnKey}`}
          options={field.options}
          required={field.required}
        />

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </Form.Group>
    );
  }

  renderDateField(field) {
    // TODO:
    return (
      <div key={field.columnKey}>TODO: Date Field</div>
    );
  }

  renderFileUploadField(field) {
    // TODO:
    return (
      <div key={field.columnKey}>TODO: File Upload</div>
    );
  }

  renderImageUploadField(field) {
    // TODO:
    return (
      <div key={field.columnKey}>TODO: Image Upload</div>
    );
  }

  renderTitleField(field) {
    return (
      <div key={field.columnKey} className="field field--title">
        {field.question || field.label}

        {field.explanation &&
          <div className="explanation">{field.explanation}</div>
        }
      </div>
    );
  }

  renderHiddenField(field) {
    return (
      <FormElement
        key={field.columnKey}
        field={`extend.${field.columnKey}`}
        value={field.value}
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
