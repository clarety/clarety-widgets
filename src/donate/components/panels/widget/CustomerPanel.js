import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import { BasePanel } from 'shared/components';
import { TextInput, StateInput, SubmitButton, BackButton, ErrorMessages, FormElement } from 'form/components';
import { StepIndicator } from 'donate/components';
import 'react-block-ui/style.css';

export class CustomerPanel extends BasePanel {
  onShowPanel() {
    this.scrollIntoView();
  }

  onPressBack = (event) => {
    event.preventDefault();

    this.props.prevPanel();
  };

  onPressNext = async (event) => {
    event.preventDefault();

    const isValid = await this.props.onSubmit();
    if (isValid) this.props.nextPanel();
  };

  renderWait() {
    // TODO:
    return null;
  }

  renderEdit() {
    return (
      <form onSubmit={this.onPressNext} data-testid="customer-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { forceMd, isBusy } = this.props;

    return (
      <Card>
        <Card.Header className="text-center">
          <StepIndicator />
        </Card.Header>
    
        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={forceMd ? null : 8}>

              <ErrorMessages />

              <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>
            
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
                  <TextInput field="customer.email" type="email" testId="email-input" />
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
                      <TextInput field="customer.billing.postcode" testId="postcode-input" />
                    </Form.Group>
                  </Col>
                </Form.Row>

                <FormElement field="customer.billing.country" value="AU" />

              </BlockUi>

            </Col>
          </Row>
        </Card.Body>
    
        <Card.Footer>
          <Form.Row className="justify-content-center">
            <Col xs={4} lg={forceMd ? null : 2}>
              <BackButton title="Back" block onClick={this.onPressBack} />
            </Col>
            <Col xs={8} lg={forceMd ? null : 3}>
              <SubmitButton title="Next" block testId="next-button" />
            </Col>
          </Form.Row>
        </Card.Footer>
      </Card>
    );
  }

  renderDone() {
    // TODO:
    return null;
  }
}
