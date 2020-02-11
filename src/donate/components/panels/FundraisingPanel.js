import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { TextAreaInput, CheckboxInput } from 'form/components';

export class FundraisingPanel extends BasePanel {
  fields = [
    'fundraising.message',
    'fundraising.isAnonymous',
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
      <PanelContainer layout={layout} status="wait">
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
      <form onSubmit={this.onPressNext} data-testid="fundraising-panel">
        {this.renderContent()}
      </form>
    );
  }

  renderContent() {
    const { layout, isBusy, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
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
      <PanelContainer layout={layout} status="done">
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
