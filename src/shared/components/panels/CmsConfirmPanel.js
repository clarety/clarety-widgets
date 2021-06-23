import React from 'react';
import { BasePanel, PanelContainer, PanelBody } from 'shared/components';
import { getCmsConfirmContent } from 'shared/utils';

export class CmsConfirmPanel extends BasePanel {
  state = {
    confirmContent: '',
  };

  onShowPanel() {
    const { elementId, fields, layout, settings } = this.props;

    this.setState({
      confirmContent: settings.confirmContent || getCmsConfirmContent(elementId, fields),
    });

    if (layout === 'tabs') this.scrollIntoView();
  }

  renderWait() {
    return null;
  }

  renderEdit() {
    const { layout } = this.props;
    const html = { __html: this.state.confirmContent };

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
