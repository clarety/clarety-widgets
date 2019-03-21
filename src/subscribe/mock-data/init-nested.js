export default {
  requestId: '',
  success: true,
  result: [
    {
      resource: 'subscribe',
      elements: {
        email: {
          name: 'Customer Email',
          property: 'email',
          methods: ['get', 'post'],
          example: 'psherman@dentist.io',
          description: 'Customer Email',
          options: [],
        },
        billingId: {
          address1: {
            name: 'Customer Address 1',
            property: 'address1',
            methods: ['get', 'post'],
            example: '42 Walaby Way',
            description: 'Customer Address 1',
            options: [],
          },
          address2: {
            name: 'Customer Address 2',
            property: 'address2',
            methods: ['get', 'post'],
            example: '42 Walaby Way',
            description: 'Customer Address 2',
            options: [],
          },
          country: {
            name: 'Customer Country',
            property: 'country',
            methods: ['get', 'post'],
            example: 'AU',
            description: 'Customer Country',

            // 'options' as an object.
            options: {
              "AU": "Australia",
              "US": "United States",
              "UK": "United Kingdom",
            },
            
            // 'options' as an array of objects.
            optionsAlt : [
              {
                "value": "AU",
                "label": "Australia",
              },
              {
                "value": "US",
                "label": "United States",
              },
              {
                "value": "UK",
                "label": "United Kingdom",
              },
            ],
          }
        },
      }
    } 
  ]
};
