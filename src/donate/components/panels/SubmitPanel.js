import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';
import { SubmitButton } from 'form/components';

export class SubmitPanel extends BasePanel {
  renderWait() {
    return null;
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit();
  };

  renderEdit() {
    const { layout, isBusy, settings } = this.props;

    return (
      <form onSubmit={this.onSubmit}>
        <PanelContainer layout={layout} status="edit" className="submit-panel">
          <PanelBody layout={layout} status="edit" isBusy={isBusy}>
            <Row>
              <Col>
                <SubmitButton
                  title={settings.buttonText || 'Donate'}
                  testId="donate-button"
                  block
                />
              </Col>
            </Row>
          </PanelBody>
        </PanelContainer>
      </form>
    );
  }

  renderDone() {
    return null;
  }
}
