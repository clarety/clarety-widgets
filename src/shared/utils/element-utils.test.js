import { findElement, parseNestedElements } from './element-utils';

describe('findElement', () => {
  it('finds a non-nested element', () => {
    const elements = [
      {
        'property': 'firstName',
        'field': 'firstName',
      },
    ];

    const element = findElement('firstName', elements);
    expect(element.field).toBe('firstName');
  });

  it('finds a one level nested element', () => {
    const elements = [
      {
        'property': 'customer',
        'resource': 'customer',
        'elements': [
          {
            'property': 'firstName',
            'field': 'customer.firstName',
          },
        ],
      }
    ];

    const element = findElement('customer.firstName', elements);
    expect(element.field).toBe('customer.firstName');
  });

  it('finds a two level nested element', () => {
    const elements = [
      {
        'property': 'customer',
        'resource': 'customer',
        'elements': [
          {
            'property': 'billing',
            'resource': 'address',
            'elements': [
              {
                'property': 'address1',
                'field': 'customer.billing.address1',
              }
            ]
          }
        ]
      }
    ];

    const element = findElement('customer.billing.address1', elements);
    expect(element.field).toBe('customer.billing.address1');
  });

  it('throws an error when a non-nested element does not exist', () => {
    const elements = [
      { property: 'firstName' },
    ];

    expect(() => findElement('lastName', elements))
      .toThrowError();
  });

  it('throws an error when a nested element does not exist', () => {
    const elements = [
      {
        'property': 'customer',
        'resource': 'customer',
        'elements': [
          { 'property': 'firstName' },
        ],
      }
    ];

    expect(() => findElement('customer.lastName', elements))
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
