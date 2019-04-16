export default {
  requestId: '',
  success: true,
  result: [
    {
      resource: 'subscribe',
      elements: [
        {
          property: 'name',
        },
        {
          property: 'email',
        },
        {
          property: 'country',
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
