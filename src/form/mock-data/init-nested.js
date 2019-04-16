export default {
  requestId: '',
  success: true,
  result: [
    {
      resource: 'subscribe',
      elements: [
        {
          property: 'email',
        },
        {
          property: 'billingId',
          elements: [
            {
              property: 'address1',
            },
            {
              property: 'address2',
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
          ],
        },
      ]
    } 
  ]
};
