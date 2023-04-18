import React from 'react';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';

export class ConfirmPanel extends BasePanel {
  renderWait() {
    return null;
  }

  renderEdit() {
    const { layout, settings } = this.props;
    const content = settings.confirmContent || t('opt-in-confirm', 'Thank you for subscribing!');

    return (
      <PanelContainer layout={layout} status="edit" className="confirm-panel">
        <PanelBody layout={layout} status="edit">
          <p className="confirm-panel-content">
            {content}
          </p>
        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    return null;
  }
}
