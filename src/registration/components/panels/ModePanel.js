import React from 'react';
import { Button } from 'react-bootstrap';
import { t } from 'shared/translations';
import { BasePanel, PanelContainer, PanelHeader, PanelBody } from 'shared/components';
import { capitalize } from 'shared/utils';

export class ModePanel extends BasePanel {
  onSelectMode = (mode) => {
    const { updateAppSettings, nextPanel } = this.props;

    updateAppSettings({ registrationMode: mode });
    nextPanel();
  };

  onClickEdit = () => {
    this.props.editPanel();
  };

  renderWait() {
    const { layout, index } = this.props;

    return (
      <PanelContainer layout={layout} status="wait">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    const { layout, isBusy, index } = this.props;

    return (
      <PanelContainer layout={layout} status="edit">
        <PanelHeader
          status="edit"
          layout={layout}
          number={index + 1}
          title={t('modePanel.editTitle', 'Registrations')}
        />

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <p>{t('modePanel.prompt', 'Are you registering as an individual or a group?')}</p>

          <div className="panel-actions">
            <Button onClick={() => this.onSelectMode('individual')}>{t('btn.individual', 'Individual')}</Button>
            <Button onClick={() => this.onSelectMode('group')}>{t('btn.group', 'Group')}</Button>
          </div>

        </PanelBody>
      </PanelContainer>
    );
  }
  
  renderDone() {
    const { layout, index, selectedMode } = this.props;

    return (
      <PanelContainer layout={layout} status="done">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={t('modePanel.doneTitle', 'Registrations')}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
          <p>{capitalize(selectedMode)} Registration</p>
          <Button onClick={this.onClickEdit}>{t('btn.edit', 'Edit')}</Button>
        </PanelBody>
      </PanelContainer>
    );
  }
}
