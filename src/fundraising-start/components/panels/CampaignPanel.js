import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { requiredField } from 'shared/utils';
import { TextInput, SubmitButton } from 'form/components';

export class CampaignPanel extends BasePanel {
  onPressNext = (event) => {
    event.preventDefault();

    if (this.validate()) {
      this.props.nextPanel();
    }
  };

  validate() {
    const { formData, setErrors } = this.props;
    const errors = [];

    requiredField(errors, formData, 'campaign.name');
    requiredField(errors, formData, 'campaign.goal');

    setErrors(errors);
    return errors.length === 0;
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title="Start a Campaign"
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index } = this.props;

    return (
      <PanelContainer layout={layout}>
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title="Start a Campaign"
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <Form onSubmit={this.onPressNext}>
            <Form.Row>
              <Col>
                <Form.Group>
                  <TextInput field="campaign.name" placeholder="Campaign Name" />
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Row>
              <Col>
                <Form.Group>
                  <TextInput field="campaign.goal" placeholder="Campaign Amount" />
                </Form.Group>
              </Col>
            </Form.Row>
            
            <div className="panel-actions">
              <SubmitButton title="Continue" isBusy={isBusy} />
            </div>
          </Form>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, formData } = this.props;
    const title = formData['campaign.name'];

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
