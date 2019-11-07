import React from 'react';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';

export class CmsConfirmPanel extends BasePanel {
  renderWait() {
    return null;
  }

  renderEdit() {
    const { layout, settings } = this.props;
    const html = { __html: settings.confirmContent };

    return (
      <PanelContainer layout={layout} status="edit" className="cms-confirm-panel">
        <PanelBody layout={layout} status="edit">

          <div dangerouslySetInnerHTML={html} />

        </PanelBody>
      </PanelContainer>
    );
  }

  renderDone() {
    return null;
  }
}
