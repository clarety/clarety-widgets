import React from 'react';
import { Form } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { SubmitButton, CheckboxInput } from 'form/components';

export class SessionPanel extends BasePanel {
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
    // Override in subclass.
  }

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="session-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title || 'Select Sessions'}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  canContinue() {
    const { sessions, formData } = this.props;

    // Check if a session has been selected.
    for (const session of sessions) {
      if (formData[`sessions.${session.sessionUid}`]) {
        return true;
      }
    }

    return false;
  }

  renderEdit() {
    const { layout, isBusy, index, settings, sessions } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="session-panel">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={settings.title || 'Select Sessions'}
        />
        
        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <Form onSubmit={this.onPressNext}>

            <div className="session-list">
              {sessions.map((session, index) =>
                <CheckboxInput
                  key={index}
                  field={`sessions.${session.sessionUid}`}
                  label={session.displayDate}
                />
              )}
            </div>
            
            <div className="panel-actions">
              <SubmitButton title="Continue" isBusy={isBusy} isDisabled={!this.canContinue()} />
            </div>
          </Form>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, sessions, formData } = this.props;

    const selectedSessions = sessions.filter(session => !!formData[`sessions.${session.sessionUid}`]);

    return (
      <PanelContainer layout={layout} status="done" className="session-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title || 'Select Sessions'}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="edit">
          {selectedSessions.map((session, index) =>
            <p key={index}>{session.displayDate}</p>
          )}
        </PanelBody>
      </PanelContainer>
    );
  }
}
