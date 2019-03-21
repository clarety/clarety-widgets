export default {
  requestId: "",
  success: true,
  result: [
    {
      status: "error",
      validationErrors: [
        {
          code: "R1000",
          message: "Something went wrong...",
        },
        {
          code: "R1000",
          message: "Name is required",
          field: "name",
        },
        {
          code: null,
          message: "You must enter a valid email",
          field: "email",
        }
      ]
    }
  ]
};
