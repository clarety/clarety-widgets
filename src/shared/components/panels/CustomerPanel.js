import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import { scrollIntoView } from 'shared/utils';
import { TextInput, EmailInput, PhoneInput, CheckboxInput, StateInput, PostcodeInput, SubmitButton, ErrorMessages, FormElement } from 'form/components';
import { BasePanel } from 'donate/components';

export class CustomerPanel extends BasePanel {
  componentDidMount() {
    scrollIntoView(this);
  }

  onClickSubmit = async (event) => {
    event.preventDefault();
    this.props.onSubmit();
  };

  render() {
    return (
      <form onSubmit={this.onClickSubmit}>
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { isBusy, title, subtitle, submitBtnText } = this.props;
    const { showOptIn, optInText } = this.props;

    return (
      <Card>
        <Card.Body>

          <ErrorMessages />

          <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>

            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
        
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
                  <PhoneInput field="customer.mobile" placeholder="Mobile Number" country="AU" />
                </Form.Group>
              </Col>
            </Form.Row>

            {this.renderAddressFields()}

            <Row>
              <Col className="text-center">
                <SubmitButton title={submitBtnText} />
              </Col>
            </Row>

            {showOptIn &&
              <Form.Row>
                <Col className="text-center">
                  <Form.Group>
                    <CheckboxInput field="customer.optIn" label={optInText} />
                  </Form.Group>
                </Col>
              </Form.Row>
            }

          </BlockUi>

        </Card.Body>
      </Card>
    );
  }

  renderAddressFields() {
    if (this.props.addressType === 'postcode-only') {
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
}
