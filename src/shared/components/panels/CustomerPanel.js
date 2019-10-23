import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { TextInput, EmailInput, PhoneInput, CheckboxInput, StateInput, PostcodeInput, SubmitButton, ErrorMessages, FormElement } from 'form/components';

export class CustomerPanel extends BasePanel {
  onClickSubmit = async (event) => {
    event.preventDefault();
    this.props.onSubmit();
  };

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Personal Details"
          intlId="customerPanel.waitTitle"
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
          intlId="customerPanel.editTitle"
        />

        <PanelBody status="edit" layout={layout} isBusy={isBusy}>
          <ErrorMessages />

          <Form onSubmit={this.onClickSubmit}>

            <Form.Row>
              <Col sm>
                <Form.Group>
                  <TextInput field="customer.firstName" placeholder="First Name *" />
                </Form.Group>
              </Col>
              <Col sm>
                <Form.Group>
                  <TextInput field="customer.lastName" placeholder="Last Name *" />
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <Form.Group>
                  <EmailInput field="customer.email" placeholder="Email" />
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <Form.Group>
                  <PhoneInput field="customer.mobile" placeholder="Mobile" country="AU" />
                </Form.Group>
              </Col>
            </Form.Row>

            {this.renderAddressFields(settings.addressType)}

            <Row className="panel-actions">
              <Col className="text-center">
                <SubmitButton title={settings.submitBtnText} />
              </Col>
            </Row>

            {settings.showOptIn &&
              <Form.Row>
                <Col className="text-center">
                  <Form.Group>
                    <CheckboxInput field="optIn" label={settings.optInText} />
                  </Form.Group>
                </Col>
              </Form.Row>
            }

          </Form>

        </PanelBody>
      </PanelContainer>
    );
  }

  renderAddressFields(addressType) {
    if (addressType === 'none') {
      return null;
    }

    if (addressType === 'postcode') {
      return this.renderPostCodeField();
    }

    return this.renderAustralianAddressFields();
  }

  renderPostCodeField() {
    return (
      <Form.Row>
        <Col sm>
          <Form.Group>
            <PostcodeInput field="customer.billing.postcode" placeholder="Postcode" />
          </Form.Group>
        </Col>
        <Col sm></Col>
      </Form.Row>
    );
  }

  renderAustralianAddressFields() {
    return (
      <React.Fragment>
        <Form.Row>
          <Col>
            <Form.Group>
              <TextInput field="customer.billing.address1" placeholder="Address" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group>
              <TextInput field="customer.billing.suburb" placeholder="Suburb" />
            </Form.Group>
          </Col>

          <Col sm>
            <Form.Group>
              <StateInput field="customer.billing.state" placeholder="State" />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col sm>
            <Form.Group>
              <PostcodeInput field="customer.billing.postcode" placeholder="Postcode" />
            </Form.Group>
          </Col>
          <Col sm></Col>
        </Form.Row>

        <FormElement field="customer.billing.country" value="AU" />
      </React.Fragment>
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
