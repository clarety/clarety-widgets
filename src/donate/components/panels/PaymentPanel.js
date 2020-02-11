import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import BlockUi from 'react-block-ui';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { SubmitButton, BackButton, ErrorMessages, CardNumberInput, ExpiryInput, CcvInput } from 'form/components';
import 'react-block-ui/style.css';

export class PaymentPanel extends BasePanel {
  fields = [
    'payment.cardNumber',
    'payment.expiry',
    'payment.ccv',
  ];

  onShowPanel() {
    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  componentDidUpdate() {
    if (this.props.layout === 'page' && this.hasError()) {
      this.scrollIntoView();
    }
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
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="payment-panel">
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
      <form onSubmit={this.onPressNext} data-testid="payment-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="payment-panel">
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

              <ErrorMessages />

              <BlockUi tag="div" blocking={isBusy} loader={<span></span>}>

                <Card.Text className="donation-summary">
                  Donation Amount: <b>{this.props.amount}</b>
                </Card.Text>
        
                <Form.Group controlId="cardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <CardNumberInput field="payment.cardNumber" testId="card-number-input" />
                </Form.Group>
        
                <Form.Row>
                  <Col>
                    <Form.Group controlId="cardExpMonth">
                      <Form.Label>Expiry</Form.Label>
                      <ExpiryInput
                        field="payment.expiry"
                        monthField="payment.expiryMonth"
                        yearField="payment.expiryYear"
                        testId="expiry-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="ccv">
                      <Form.Label>CCV</Form.Label>
                      <CcvInput field="payment.ccv" testId="ccv-input" />
                    </Form.Group>
                  </Col>
                </Form.Row>

              </BlockUi>

            </Col>
          </Row>
        </PanelBody>
  
        <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
          <Form.Row className="justify-content-center">
            {layout !== 'page' &&
              <Col xs={4}>
                <BackButton title="Back" onClick={this.onPressBack} block />
              </Col>
            }
            <Col xs={8}>
              <SubmitButton title="Donate" block testId="next-button" />
            </Col>
          </Form.Row>
        </PanelFooter>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="payment-panel">
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
