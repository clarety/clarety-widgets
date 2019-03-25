import { getNestedElement, parseNestedElements } from './element-utils';

describe('getNestedElement', () => {
  it('gets a non-nested element', () => {
    const elements = {
      firstName: {
        name: 'First Name',
      }
    };

    const property = 'firstName';

    const element = getNestedElement(property, elements);

    expect(element.name).toBe('First Name');
  });

  it('gets a one level nested element', () => {
    const elements = {
      billingId: {
        address1: {
          name: 'Customer Address 1',
        }
      }
    };

    const property = 'billingId.address1';

    const element = getNestedElement(property, elements);

    expect(element.name).toBe('Customer Address 1');
  });

  it('gets a two level nested element', () => {
    const elements = {
      address: {
        billing: {
          city: {
            name: 'Billing Address City'
          }
        }
      }
    };

    const property = 'address.billing.city';

    const element = getNestedElement(property, elements);

    expect(element.name).toBe('Billing Address City');
  });

  it('throws an error when a non-nested element does not exist', () => {
    const elements = {
      firstName: {
        name: 'First Name',
      }
    };

    const property = 'address';

    expect(() => getNestedElement(property, elements))
      .toThrowError();
  });

  it('throws an error when a nested element does not exist', () => {
    const elements = {
      firstName: {
        name: 'First Name',
      },
      billing: {
        city: {
          name: 'Billing City',
        }
      }
    };

    const property = 'billing.address';

    expect(() => getNestedElement(property, elements))
      .toThrowError();
  });
});

describe('parseNestedElements', () => {
  it('returns non-nested objects as-is', () => {
    const input = {
      'firstName': 'George',
      'lastName': 'Costanza',
    };

    const output = parseNestedElements(input);

    expect(output).toEqual(input);
  });

  it('handles one level of nesting', () => {
    const input = {
      'firstName': 'George',
      'lastName': 'Costanza',
      'address.street': '22 Human Fund Rd',
      'address.city': 'New York',
    };

    const output = parseNestedElements(input);

    const expected = {
      firstName: 'George',
      lastName: 'Costanza',
      address: {
        street: '22 Human Fund Rd',
        city: 'New York',
      }
    };

    expect(output).toEqual(expected);
  });

  it('handles two levels of nesting', () => {
    const input = {
      'firstName': 'George',
      'lastName': 'Costanza',
      'address.billing.street': '22 Human Fund Rd',
      'address.billing.city': 'New York',
      'address.shipping.street': '123 Fake St',
      'address.shipping.city': 'Springfield',
    };

    const output = parseNestedElements(input);

    const expected = {
      firstName: 'George',
      lastName: 'Costanza',
      address: {
        billing: {
          street: '22 Human Fund Rd',
          city: 'New York',
        },
        shipping: {
          street: '123 Fake St',
          city: 'Springfield',
        }
      }
    };

    expect(output).toEqual(expected);
  });
});
