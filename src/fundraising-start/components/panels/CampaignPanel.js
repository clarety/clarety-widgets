import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { requiredField } from 'shared/utils';
import { TextInput, CurrencyInput, SubmitButton } from 'form/components';

export class CampaignPanel extends BasePanel {
  onPressNext = (event) => {
    event.preventDefault();

    if (this.validate()) {
      this.props.nextPanel();
    }
  };

  validate() {
    const errors = [];
    this.validateFields(errors);

    this.props.setErrors(errors);
    return errors.length === 0;
  }

  validateFields(errors) {
    const { formData } = this.props;

    requiredField(errors, formData, 'campaign.name');
    requiredField(errors, formData, 'campaign.goal');
  }

  getTitle() {
    const { teamName, settings } = this.props;

    if (settings.title) {
      return settings.title;
    }

    if (teamName) {
      return `${t('join', 'Join')} ${teamName}`;
    }

    return t('start-a-campaign', 'Start a Campaign');
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={this.getTitle()}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index, settings } = this.props;

    return (
      <PanelContainer layout={layout}>
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={this.getTitle()}
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <Form onSubmit={this.onPressNext}>
            <Form.Row>
              <Col>
                <Form.Group>
                  <TextInput
                    field="campaign.name"
                    placeholder={t('campaign-name', 'Page Name')}
                    required
                  />
                </Form.Group>
              </Col>
            </Form.Row>

            {!settings.hideCampaignGoal && 
              <Form.Row>
                <Col>
                <Form.Group>
                  <CurrencyInput
                    field="campaign.goal"
                    placeholder={settings.campaignGoalLabel || t('campaign-goal', 'Fundraising Goal')}
                    required
                  />
                </Form.Group>
                </Col>
              </Form.Row>
            }
            
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
