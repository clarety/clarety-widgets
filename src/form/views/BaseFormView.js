import React from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom';
import { statuses } from 'shared/actions';
import { connectFormToStore } from 'form/utils';

export class _BaseFormView extends React.Component {
  endpoint = null;

  async componentDidMount() {
    if (!this.endpoint) throw new Error('[Clarety] BaseFormView "endpoint" must be overridden.');
    this.props.fetchSettings(this.endpoint);
  }

  onSubmit = async event => {
    const { submitForm, formData } = this.props;

    event.preventDefault();
    submitForm(this.endpoint, formData);
  };

  render() {
    if (this.props.status === statuses.initializing) {
      return null;
    }

    return (
      <ConnectedRouter history={this.props.history}>
        <Switch>
          <Route path="/success" render={this.renderSuccess} />
          <Route default render={route => (
            <form onSubmit={this.onSubmit}>
              {this.renderForm()}
            </form>
          )} />
        </Switch>
      </ConnectedRouter>
    );
  }

  renderForm() {
    throw new Error('[Clarety] BaseFormView "renderForm" must be overridden.');
  }

  renderSuccess() {
    throw new Error('[Clarety] BaseFormView "renderSuccess" must be overridden.');
  }
}

export const BaseFormView = connectFormToStore(_BaseFormView);
