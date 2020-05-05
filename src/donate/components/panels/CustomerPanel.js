import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { requiredField, emailField } from 'shared/utils';
import { TextInput, EmailInput, StateInput, PostcodeInput, SubmitButton, BackButton, ErrorMessages, FormElement } from 'form/components';

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
    const { formData } = this.props;

    requiredField(errors, formData, 'customer.firstName');
    requiredField(errors, formData, 'customer.lastName');

    requiredField(errors, formData, 'customer.email');
    emailField(errors, formData, 'customer.email');

    requiredField(errors, formData, 'customer.billing.address1');
    requiredField(errors, formData, 'customer.billing.suburb');
    requiredField(errors, formData, 'customer.billing.state');
    requiredField(errors, formData, 'customer.billing.postcode');
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
    const { layout, isBusy, index, settings, emailReadonly } = this.props;
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
            
              <Form.Row>
                <Col sm>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <TextInput field="customer.firstName" testId="first-name-input" />
                  </Form.Group>
                </Col>
                <Col sm>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <TextInput field="customer.lastName" testId="last-name-input" />
                  </Form.Group>
                </Col>
              </Form.Row>
      
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <EmailInput field="customer.email" type="email" testId="email-input" readOnly={emailReadonly} />
              </Form.Group>

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
                    <Form.Label>State</Form.Label>
                    <StateInput field="customer.billing.state" testId="state-input" />
                  </Form.Group>
                </Col>
                <Col sm>
                  <Form.Group controlId="postcode">
                    <Form.Label>Postcode</Form.Label>
                    <PostcodeInput field="customer.billing.postcode" testId="postcode-input" />
                  </Form.Group>
                </Col>
              </Form.Row>

              <FormElement field="customer.billing.country" value="AU" />

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
