import React from 'react';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';

export class ConfirmPanel extends BasePanel {
  renderWait() {
    return null;
  }

  renderEdit() {
    const { layout, settings } = this.props;
    const content = settings.confirmContent || t('unsubscribe-success', 'You have successfully unsubscribed.');

    return (
      <PanelContainer layout={layout} status="edit" className="confirm-panel">
        <PanelBody layout={layout} status="edit">

          <div className="confirm-content" dangerouslySetInnerHTML={{ __html: content }} />

        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    return null;
  }
}
