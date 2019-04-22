export default {
  requestId: '',
  success: true,
  result: [
    {
      resource: 'subscribe',
      elements: [
        {
          property: 'email',
          field: 'email',
        },
        {
          property: 'billingId',
          elements: [
            {
              property: 'address1',
              field: 'billingId.address1',
            },
            {
              property: 'address2',
              field: 'billingId.address2',
            },
            {
              property: 'country',
              field: 'billingId.country',
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
