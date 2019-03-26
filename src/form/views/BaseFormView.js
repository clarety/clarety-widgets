import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../actions/form-status-actions';
import { connectFormToStore } from '../utils/form-utils';

export class BaseFormView extends React.Component {
  endpoint = null;
  action = null;

  async componentDidMount() {
    if (!this.endpoint) throw new Error('[Clarety] BaseFormView "endpoint" must be overridden.');
    if (!this.action) throw new Error('[Clarety] BaseFormView "action" must be overridden.');

    const { setElements, setStatus } = this.props;

    const elements = await ClaretyApi.fetchElements(this.endpoint);
    if (elements) {
      setElements(elements);
      setStatus(statuses.ready);
    }
  }

  onSubmit = async (event, route) => {
    const { status, formData } = this.props;
    const { setStatus, clearValidationErrors, setValidationErrors } = this.props;

    event.preventDefault();
    if (status !== statuses.ready) return;

    setStatus(statuses.busy);
    clearValidationErrors();
    
    const result = await ClaretyApi.post(this.endpoint, this.action, formData);

    if (result.status === 'error') {
      setValidationErrors(result.validationErrors);
    } else {
      this.onSuccess(route);
    }

    setStatus(statuses.ready);
  };

  onSuccess(route) {
    route.history.push('/success');
  }

  render() {
    if (this.props.status === statuses.uninitialized) {
      return null;
    }

    return (
      <MemoryRouter>
        <Switch>
          <Route path="/success" render={this.renderSuccess} />
          <Route default render={route => (
            <form onSubmit={event => this.onSubmit(event, route)}>
              {this.renderForm()}
            </form>
          )} />
        </Switch>
      </MemoryRouter>
    );
  }

  renderForm() {
    throw new Error('[Clarety] BaseFormView "renderForm" must be overridden.');
  }

  renderSuccess() {
    throw new Error('[Clarety] BaseFormView "renderSuccess" must be overridden.');
  }
}

// Note: An un-connected BaseFormView is also exported where the class is defined.
export default connectFormToStore(BaseFormView);
