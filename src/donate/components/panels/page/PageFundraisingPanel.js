import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { TextAreaInput, CheckboxInput } from 'form/components';
import { BasePanel } from 'donate/components';

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

  hasError() {
    if (!this.fields || this.fields.length === 0) {
      return false;
    }

    const { errors } = this.props;
    for (let field of this.fields) {
      if (errors.find(error => error.field === field)) {
        return true;
      }
    }

    return false;
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} data-testid="fundraising-panel">
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
}
