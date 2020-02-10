import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { BasePanel } from 'shared/components';
import { TextAreaInput, CheckboxInput } from 'form/components';

export class PageFundraisingPanel extends BasePanel {
  fields = [
    'fundraising.message',
    'fundraising.isAnonymous',
  ];

  componentDidMount() {
  }

  componentDidUpdate() {
    if (this.hasError()) this.scrollIntoView();
  }

  renderWait() {
    // TODO:
    return null;
  }

  renderEdit() {
    return (
      <form onSubmit={this.onPressNext} data-testid="fundraising-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    return (
      <Card>
        <h4>Fundraising Details</h4>

        <Card.Body>
          <Row className="justify-content-center">
            <Col lg={6}>
              <Form.Row>
                <Col>
                  <Form.Group controlId="fundraising.isAnonymous">
                    <CheckboxInput
                      field="fundraising.isAnonymous"
                      label="Hide my name from displaying on the fundraiser's page"
                      testId="fundraising-is-anonymous-input"
                    />
                  </Form.Group>
                </Col>
              </Form.Row>

              <Form.Row>
                <Col>
                  <Form.Group controlId="fundraising.message">
                    <Form.Label>Add a message (this message is visible to everyone)</Form.Label>
                    <TextAreaInput
                      field="fundraising.message"
                      rows={4}
                      testId="fundraising-message-input"
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }

  renderDone() {
    // TODO:
    return null;
  }
}
