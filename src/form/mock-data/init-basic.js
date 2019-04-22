export default {
  requestId: '',
  success: true,
  result: [
    {
      resource: 'subscribe',
      elements: [
        {
          property: 'name',
          field: 'name',
        },
        {
          property: 'email',
          field: 'email',
        },
        {
          property: 'country',
          field: 'country',
          options : [
            {
              value: 'AU',
              label: 'Australia',
            },
            {
              value: 'US',
              label: 'United States',
            },
            {
              value: 'UK',
              label: 'United Kingdom',
            },
          ],
        }
      ]
    }
  ]
};
