import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import ClaretyApi from '../services/clarety-api';
import { statuses } from '../actions/formStatusActions';
import { connectFormToStore } from '../utils/form-utils';

export class BaseFormView extends React.Component {
  endpoint = null;
  action = null;

  async componentDidMount() {
    if (!this.endpoint) throw new Error('[Clarety] No endpoint provided.');
    if (!this.action) throw new Error('[Clarety] No action provided.');

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
    throw new Error('[Clarety] renderForm not implemented');
  }

  renderSuccess() {
    throw new Error('[Clarety] renderSuccess not implemented');
  }
}

// Note: An un-connected BaseFormView is also exported where the class is defined.
export default connectFormToStore(BaseFormView);
