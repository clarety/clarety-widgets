import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';
import { SubmitButton } from 'form/components';

export class SubmitPanel extends BasePanel {
  renderWait() {
    return null;
  }

  onPressSubmit = async (event) => {
    event.preventDefault();

    const { onSubmit, nextPanel } = this.props;

    const isValid = this.validate();
    if (!isValid) return;
    
    const didSubmit = await onSubmit();
    if (!didSubmit) return;

    nextPanel();
  };

  validate() {
    // Validate any panels with a 'validate' function.
    for (const panel of this.props.panelRefs) {
      if (panel === this) continue;
      if (!panel.validate) continue;

      if (!panel.validate()) {
        panel.scrollIntoView();
        return false;
      }
    }

    return true;
  }

  renderEdit() {
    const { layout, isBusy, settings } = this.props;

    return (
      <form onSubmit={this.onPressSubmit}>
        <PanelContainer layout={layout} status="edit" className="submit-panel">
          <PanelBody layout={layout} status="edit" isBusy={isBusy}>
            <Row>
              <Col>
                <SubmitButton
                  title={settings.submitBtnText || 'Donate'}
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
