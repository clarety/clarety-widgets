export default {
  requestId: '',
  success: true,
  result: [
    {
      resource: 'subscribe',
      elements: {
        name: {
          name: 'Name',
          property: 'name',
          methods: ['get', 'post'],
          example: 'Peter',
          description: 'Subscriber Name',
          options: [],
        },

        email: {
          name: 'Email',
          property: 'email',
          methods: ['get', 'post'],
          example: 'psherman@dentist.io',
          description: 'Subscriber Email',
          options: [],
        },
      }
    }
  ]
};
