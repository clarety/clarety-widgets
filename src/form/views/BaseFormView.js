import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import ClaretyApi from '../../shared/services/clarety-api';
import { statuses } from '../../shared/actions';
import { connectFormToStore } from '../utils/form-utils';

export class BaseFormView extends React.Component {
  endpoint = null;

  async componentDidMount() {
    if (!this.endpoint) throw new Error('[Clarety] BaseFormView "endpoint" must be overridden.');

    const { setElements, setStatus } = this.props;

    const explain = await ClaretyApi.explain(this.endpoint);
    if (explain) {
      setElements(explain.elements);
      setStatus(statuses.ready);
    }
  }

  onSubmit = async (event, route) => {
    const { status, formData } = this.props;
    const { setStatus, clearErrors, setErrors } = this.props;

    event.preventDefault();
    if (status !== statuses.ready) return;

    setStatus(statuses.busy);
    clearErrors();
    
    const result = await ClaretyApi.post(this.endpoint, formData);
    if (result) {
      if (result.status === 'error') {
        setErrors(result.validationErrors);
        setStatus(statuses.ready);
      } else {
        this.onSuccess(route);
      }
    }
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

// Note: An un-wrapped BaseFormView is also exported above.
export default connectFormToStore(BaseFormView);
