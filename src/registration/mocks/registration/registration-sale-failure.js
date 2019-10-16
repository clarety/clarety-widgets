export const registrationSaleFailure = {
  "requestId": "",
  "success": true,
  "result": [
    {
      "status": "error",
      "validationErrors": [
        {
          "code": "R1000",
          "message": "First name is required",
          "field": "registrations0.customer.firstName"
        },
        {
          "code": "R1000",
          "message": "Last name is required",
          "field": "registrations0.customer.lastName"
        }
      ]
    }
  ]
};
