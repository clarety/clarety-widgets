import React from 'react';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';

export class ConfirmPanel extends BasePanel {
  renderWait() {
    return null;
  }

  renderEdit() {
    const { layout, settings } = this.props;
    const content = settings.confirmContent || t('thank-you', 'Thank you!');

    return (
      <PanelContainer layout={layout} status="edit" className="confirm-panel">
        <PanelBody layout={layout} status="edit">
          {content}
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    return null;
  }
}
