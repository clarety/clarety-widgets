import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { requiredField, emailField, customerTypeOptions } from 'shared/utils';
import { TextInput, EmailInput, StateInput, CountryInput, SelectInput, PostcodeInput, SubmitButton, BackButton, ErrorMessages, FormElement } from 'form/components';

export class CustomerPanel extends BasePanel {
  onShowPanel() {
    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
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

    nextPanel();
  };

  validate() {
    const errors = [];
    this.validateFields(errors);

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { formData, settings } = this.props;

    if (settings.showCustomerType) {
      requiredField(errors, formData, 'customer.type');
    }

    if (formData['customer.type'] === 'business') {
      requiredField(errors, formData, 'customer.businessName');
    }

    requiredField(errors, formData, 'customer.firstName');
    requiredField(errors, formData, 'customer.lastName');

    requiredField(errors, formData, 'customer.email');
    emailField(errors, formData, 'customer.email');

    requiredField(errors, formData, 'customer.billing.address1');
    requiredField(errors, formData, 'customer.billing.suburb');
    requiredField(errors, formData, 'customer.billing.state');
    requiredField(errors, formData, 'customer.billing.postcode');
    requiredField(errors, formData, 'customer.billing.country');

    if (this.shouldShowSourceFields()) {
      requiredField(errors, formData, 'sale.sourceId');

      const question = this.getSourceQuestion();
      if (question && question.isRequired) {
        requiredField(errors, formData, 'sale.sourceAdditional');
      }
    }
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="customer-panel">
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
      <form onSubmit={this.onPressNext} data-testid="customer-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="customer-panel">
        {!settings.hideHeader &&
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={settings.title}
          />
        }

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <Row className="justify-content-center">
            <Col>
              {layout !== 'page' && <ErrorMessages />}
              {this.renderTypeFields()}
              {this.renderBasicFields()}
              {this.renderAddressFields()}
              {this.renderSourceFields()}
            </Col>
          </Row>
        </PanelBody>
    
        {layout !== 'page' &&
          <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
            <Form.Row className="justify-content-center">
              <Col xs={4}>
                <BackButton title="Back" block onClick={this.onPressBack} />
              </Col>
              <Col xs={8}>
                <SubmitButton title="Next" block testId="next-button" />
              </Col>
            </Form.Row>
          </PanelFooter>
        }
      </PanelContainer>
    );
  }

  renderTypeFields() {
    const { settings, formData } = this.props;
    const showBusinessName = formData['customer.type'] === 'business';

    return (
      <React.Fragment>
        {settings.showCustomerType &&
          <Form.Row>
            <Col>
              <Form.Group controlId="customerType">
                <Form.Label>Type</Form.Label>
                <SelectInput
                  field="customer.type"
                  options={customerTypeOptions}
                  initialValue={customerTypeOptions[0].value}
                  testId="customer-type-input"
                  required
                />
              </Form.Group>
            </Col>
          </Form.Row>
        }

        {showBusinessName &&
          <Form.Row>
            <Col>
              <Form.Group controlId="businessName">
                <Form.Label>Business Name</Form.Label>
                <TextInput field="customer.businessName" testId="business-name-input" required />
              </Form.Group>
            </Col>
          </Form.Row>
        }
      </React.Fragment>
    );
  }

  renderBasicFields() {
    const { emailReadonly } = this.props;

    return (
      <React.Fragment>
        <Form.Row>
          <Col sm>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <TextInput field="customer.firstName" testId="first-name-input" required />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <TextInput field="customer.lastName" testId="last-name-input" required />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <EmailInput field="customer.email" type="email" testId="email-input" readOnly={emailReadonly} required />
        </Form.Group>
      </React.Fragment>
    );
  }

  renderAddressFields() {
    const country = this.props.formData['customer.billing.country'];

    return (
      <React.Fragment>
        {this.renderCountryField()}

        <Form.Row>
          <Col sm>
            <Form.Group controlId="street">
              <Form.Label>Street</Form.Label>
              <TextInput field="customer.billing.address1" type="street" testId="street-input" />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="suburb">
              <Form.Label>Suburb</Form.Label>
              <TextInput field="customer.billing.suburb" testId="suburb-input" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group controlId="state">
              <Form.Label>{country === 'UK' ? 'Region' : 'State'}</Form.Label>
              <StateInput field="customer.billing.state" country={country} testId="state-input" />
            </Form.Group>
          </Col>
          <Col sm>
            <Form.Group controlId="postcode">
              <Form.Label>{country === 'US' ? 'Zip Code' : 'Postcode'}</Form.Label>
              <PostcodeInput field="customer.billing.postcode" testId="postcode-input" />
            </Form.Group>
          </Col>
        </Form.Row>
      </React.Fragment>
    );
  }

  renderCountryField() {
    const { settings, defaultCountry } = this.props;

    if (!settings.showCountry) {
      return (
        <FormElement
          field="customer.billing.country"
          value={defaultCountry}
        />
      );
    }

    return (
      <Form.Row>
        <Col>
          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <CountryInput
              field="customer.billing.country"
              initialValue={defaultCountry}
              testId="country-input"
            />
          </Form.Group>
        </Col>
      </Form.Row>
    );
  }

  renderSourceFields() {
    if (!this.shouldShowSourceFields()) return null;

    const sourceQuestion = this.getSourceQuestion();

    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group controlId="customerSource">
              <Form.Label>How did you hear about us?</Form.Label>
              <SelectInput
                field="sale.sourceId"
                options={this.props.sourceOptions}
                testId="source-id-input"
                required
              />
            </Form.Group>
          </Col>
        </Form.Row>

        {sourceQuestion &&
          <Form.Row>
            <Col>
              <Form.Group controlId="customerSourceAdditional">
                <Form.Label>{sourceQuestion.question}</Form.Label>
                <TextInput
                  field="sale.sourceAdditional"
                  required={sourceQuestion.isRequired}
                  testId="source-additional-input"
                />
              </Form.Group>
            </Col>
          </Form.Row>
        }
      </React.Fragment>
    );
  }

  shouldShowSourceFields() {
    const { tracking, sourceOptions, settings } = this.props;

    if (tracking.sourceId) return false;
    if (!sourceOptions) return false;

    return settings.showSource;
  }

  getSourceQuestion() {
    const { sourceQuestions } = this.props;

    if (!sourceQuestions) return null;

    const source = this.props.formData['sale.sourceId'];
    if (!source) return null;

    return sourceQuestions[source];
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="customer-panel">
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
