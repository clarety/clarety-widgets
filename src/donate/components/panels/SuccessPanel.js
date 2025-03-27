import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { BasePanel, PanelContainer, PanelHeader, PanelBody, PanelFooter } from 'shared/components';

export class SuccessPanel extends BasePanel {
  onShowPanel() {
    if (this.props.layout === 'tabs') {
      this.scrollIntoView();
    }
  }

  renderWait() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="wait" className="success-panel">
        <PanelHeader
          status="wait"
          layout={layout}
          number={index + 1}
          title={settings.title}
        />

        <PanelBody layout={layout} status="wait">
        </PanelBody>
      </PanelContainer>
    );
  }

  renderEdit() {
    return this.renderContent();
  }

  renderContent() {
    const { layout, isBusy, index, settings, customer } = this.props;

    return (
      <PanelContainer layout={layout} status="edit" className="success-panel">
        {!settings.hideHeader &&
          <PanelHeader
            status="edit"
            layout={layout}
            number={index + 1}
            title={settings.title}
          />
        }

        <PanelBody layout={layout} status="edit" isBusy={isBusy}>
          <Card.Text>Thank you for your kind donation to Human Fund, your generosity is greatly appreciated. A receipt has be sent to your email address. All donations over $2 are tax deductible.</Card.Text>
          <Card.Text>If you have any issues or inquiries please don't hesitate to email <a href="mailto:gcostanza@humanfund.org">gcostanza@humanfund.org</a>.</Card.Text>
        </PanelBody>

        <Table className="mb-0">
          <tbody>
            <tr>
              <th scope="row">Email</th>
              <td>{customer.email}</td>
            </tr>
          </tbody>
        </Table>

        <PanelFooter layout={layout} status="edit" isBusy={isBusy}>
        </PanelFooter>
      </PanelContainer>
    );
  }

  renderDone() {
    const { layout, index, settings } = this.props;

    return (
      <PanelContainer layout={layout} status="done" className="success-panel">
        <PanelHeader
          status="done"
          layout={layout}
          number={index + 1}
          title={settings.title}
          onPressEdit={this.onPressEdit}
        />

        <PanelBody layout={layout} status="done">
        </PanelBody>
      </PanelContainer>
    );
  }
}
