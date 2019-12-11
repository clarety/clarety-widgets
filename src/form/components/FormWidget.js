import React from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom';
import { statuses } from 'shared/actions';
import { connectFormToStore } from 'form/utils';

export class _FormWidget extends React.Component {
  className = 'clarety-form-widget';
  endpoint = null;

  async componentDidMount() {
    if (!this.endpoint) throw new Error('[Clarety] FormWidget "endpoint" must be overridden.');
    await this.props.fetchSettings(this.endpoint);
  }

  onSubmit = async (event) => {
    const { submitForm, formData } = this.props;

    event.preventDefault();
    submitForm(this.endpoint, formData);
  };

  render() {
    if (this.props.status === statuses.initializing) {
      return null;
    }

    return (
      <div className={this.className}>
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
      </div>
    );
  }

  renderForm() {
    throw new Error('[Clarety] FormWidget "renderForm" must be overridden.');
  }

  renderSuccess() {
    throw new Error('[Clarety] FormWidget "renderSuccess" must be overridden.');
  }
}

export const FormWidget = connectFormToStore(_FormWidget);
