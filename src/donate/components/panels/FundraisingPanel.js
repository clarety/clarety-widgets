import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';
import { TextAreaInput, CheckboxInput, SubmitButton, BackButton } from 'form/components';

export class FundraisingPanel extends BasePanel {
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
    const { formData, setErrors } = this.props;

    const errors = [];

    //NOTE: no fields require validation yet.

    setErrors(errors);
    return errors.length === 0;
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="fundraising-panel">
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
    const { layout, isBusy } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="fundraising-panel">
        {this.renderHeader()}

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          {this.renderFields()}
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

  renderFields() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  renderFooter() {
    const { layout, isBusy } = this.props;
    if (layout === 'page') return null;

    return (
      <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        <Form.Row className="justify-content-center">
          <Col xs={6}>
            <BackButton title="Back" block onClick={this.onPressBack} />
          </Col>
          <Col xs={6}>
            <SubmitButton title="Next" block testId="next-button" />
          </Col>
        </Form.Row>
      </PanelFooter>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="fundraising-panel">
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
