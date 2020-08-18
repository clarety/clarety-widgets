import { CustomerConnect as SharedCustomerConnect } from 'shared/components';
import { createRsvp } from 'rsvp/actions';

export class CustomerConnect extends SharedCustomerConnect {
  static actions = {
    ...SharedCustomerConnect.actions,
    onSubmit: createRsvp,
  };
}
