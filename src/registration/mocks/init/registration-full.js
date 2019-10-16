export const registrationFull = {
  "requestId": "",
  "success": true,
  "result": [
      {
          "seriesId": "2",
          "name": "The Movement 2019",
          "events": [
              {
                  "eventId": "3",
                  "seriesId": "2",
                  "name": "2019 Brisbane",
                  "state": "",
                  "country": "",
                  "startDate": "2019-09-10",
                  "registrationTypes": {
                      "adult": {
                          "eventId": "3",
                          "registrationType": "adult",
                          "name": "Adult",
                          "description": "Ages 17+",
                          "type": "individual",
                          "offers": [
                              {
                                  "offerId": "30",
                                  "name": "2019 Brisbane - Run Adult",
                                  "shortDescription": "",
                                  "amount": "0.00",
                                  "ageCalculationDate": "",
                                  "minAgeOver": "17",
                                  "maxAgeUnder": "",
                                  "registrationProducts": [
                                      {
                                          "participantType": "adult",
                                          "participantName": "Adult",
                                          "quantity": "1",
                                          "formId": "7",
                                          "products": [
                                              {
                                                  "productId": "13",
                                                  "name": "2019 Brisbane - Run Adult"
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }
                  },
                  "addOns": [],
                  "merchandise": []
              }
          ],
          "donation": {
              "offerId": "7",
              "name": "Sample Supporter Donation"
          },
          "extendForms": [
              {
                  "formId": "7",
                  "extendFields": [
                      {
                          "columnKey": "registrationformformemergencycontact",
                          "label": "Emergency Contact Name",
                          "type": "text",
                          "explanation": "",
                          "required": true,
                          "options": []
                      },
                      {
                          "columnKey": "registrationformformemergencycontact1",
                          "label": "Emergency Contact Number",
                          "type": "phonenumber",
                          "explanation": "",
                          "required": true,
                          "options": []
                      },
                      {
                          "columnKey": "registrationformformsupportsocial",
                          "label": "Are you willing to support the Walk for Freedom efforts through social media?",
                          "type": "select",
                          "explanation": "",
                          "required": true,
                          "options": {
                              "": "",
                              "true": "Yes",
                              "false": "No"
                          }
                      },
                      {
                          "columnKey": "registrationformformsupportvolunteer",
                          "label": "Are you willing to volunteer at the Walk for Freedom event?",
                          "type": "select",
                          "explanation": "",
                          "required": true,
                          "options": {
                              "": "",
                              "true": "Yes",
                              "false": "No"
                          }
                      },
                      {
                          "columnKey": "registrationformformsupportresources",
                          "label": "Are you willing to sponsor/mobilize resources for the walk?",
                          "type": "select",
                          "explanation": "",
                          "required": true,
                          "options": {
                              "": "",
                              "true": "Yes",
                              "false": "No"
                          }
                      }
                  ]
              }
          ],
          "elements": [
              {
                  "property": "customer",
                  "field": "customer",
                  "required": false,
                  "resource": "customer-simple",
                  "elements": [
                      {
                          "property": "title",
                          "field": "customer.title",
                          "required": false,
                          "resource": null,
                          "elements": [],
                          "options": [
                              {
                                  "value": 0,
                                  "label": ""
                              },
                              {
                                  "value": 1,
                                  "label": "Mr"
                              },
                              {
                                  "value": 2,
                                  "label": "Mrs"
                              },
                              {
                                  "value": 3,
                                  "label": "Miss"
                              },
                              {
                                  "value": 4,
                                  "label": "Ms"
                              },
                              {
                                  "value": 5,
                                  "label": "Br"
                              },
                              {
                                  "value": 6,
                                  "label": "Dr"
                              },
                              {
                                  "value": 7,
                                  "label": "Fr"
                              },
                              {
                                  "value": 8,
                                  "label": "Rev"
                              },
                              {
                                  "value": 9,
                                  "label": "Sr"
                              },
                              {
                                  "value": 10,
                                  "label": "Past"
                              },
                              {
                                  "value": 11,
                                  "label": "Prof"
                              },
                              {
                                  "value": 12,
                                  "label": "Rabbi"
                              }
                          ]
                      },
                      {
                          "property": "firstName",
                          "field": "customer.firstName",
                          "required": false,
                          "resource": null,
                          "elements": [],
                          "options": []
                      },
                      {
                          "property": "lastName",
                          "field": "customer.lastName",
                          "required": false,
                          "resource": null,
                          "elements": [],
                          "options": []
                      },
                      {
                          "property": "receiptName",
                          "field": "customer.receiptName",
                          "required": false,
                          "resource": null,
                          "elements": [],
                          "options": []
                      },
                      {
                          "property": "email",
                          "field": "customer.email",
                          "required": false,
                          "resource": null,
                          "elements": [],
                          "options": []
                      },
                      {
                          "property": "billing",
                          "field": "customer.billing",
                          "required": false,
                          "resource": "address",
                          "elements": [
                              {
                                  "property": "address1",
                                  "field": "customer.billing.address1",
                                  "required": false,
                                  "resource": null,
                                  "elements": [],
                                  "options": []
                              },
                              {
                                  "property": "address2",
                                  "field": "customer.billing.address2",
                                  "required": false,
                                  "resource": null,
                                  "elements": [],
                                  "options": []
                              },
                              {
                                  "property": "suburb",
                                  "field": "customer.billing.suburb",
                                  "required": false,
                                  "resource": null,
                                  "elements": [],
                                  "options": []
                              },
                              {
                                  "property": "state",
                                  "field": "customer.billing.state",
                                  "required": false,
                                  "resource": null,
                                  "elements": [],
                                  "options": []
                              },
                              {
                                  "property": "postcode",
                                  "field": "customer.billing.postcode",
                                  "required": false,
                                  "resource": null,
                                  "elements": [],
                                  "options": []
                              },
                              {
                                  "property": "country",
                                  "field": "customer.billing.country",
                                  "required": false,
                                  "resource": null,
                                  "elements": [],
                                  "options": []
                              }
                          ],
                          "options": []
                      },
                      {
                          "property": "gender",
                          "field": "customer.gender",
                          "required": false,
                          "resource": null,
                          "elements": [],
                          "options": [
                              {
                                  "value": 0,
                                  "label": ""
                              },
                              {
                                  "value": 1,
                                  "label": "Male"
                              },
                              {
                                  "value": 2,
                                  "label": "Female"
                              }
                          ]
                      }
                  ],
                  "options": []
              }
          ]
      }
  ]
};
