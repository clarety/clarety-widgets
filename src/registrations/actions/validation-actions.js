import { validateRequired, validateEmail } from 'checkout/utils';
import { setErrors } from 'checkout/actions';
import { getEvent } from 'registrations/selectors';

export function validateParticipantDetails({ intl, participantIndex, onSuccess, onFailure }) {
  return (dispatch, getState) => {
    const state = getState();
    const { formData } = state;
    const errors = [];

    _validateRequired(formData, `participants[${participantIndex}].customer.firstName`, errors);
    _validateRequired(formData, `participants[${participantIndex}].customer.lastName`, errors);
    _validateEmail(formData, `participants[${participantIndex}].customer.email`, errors);
    _validateRequired(formData, `participants[${participantIndex}].customer.gender`, errors);
    _validateRequired(formData, `participants[${participantIndex}].customer.dateOfBirthDay`, errors);
    _validateRequired(formData, `participants[${participantIndex}].customer.dateOfBirthMonth`, errors);
    _validateRequired(formData, `participants[${participantIndex}].customer.dateOfBirthYear`, errors);
    _validateRequired(formData, `participants[${participantIndex}].customer.mobile`, errors);

    _validateDob(state, participantIndex, intl, errors);

    dispatch(setErrors(errors));
    if (errors.length === 0) {
      onSuccess();
    } else {
      onFailure();
    }
  };
}


// Wrapper functions to extract values from form data.

function _validateRequired(formData, field, errors) {
  const value = formData[field];
  validateRequired(value, field, errors);
}

function _validateEmail(formData, field, errors) {
  const value = formData[field];
  validateEmail(value, field, errors);
}

function _validateDob(state, participantIndex, intl, errors) {
  const { formData } = state;

  const event = getEvent(state);
  const type = formData[`participants[${participantIndex}].type`];
  const offer = event.registrationTypes[type].offers[0];

  const eventDate = new Date(offer.ageCalculationDate || event.startDate);
  const minAge = Number(offer.minAgeOver);
  const maxAge = Number(offer.maxAgeUnder);
  const message = intl.formatMessage({ id: `validation.age.${type}` });

  const dateOfBirthDay   = formData[`participants[${participantIndex}].customer.dateOfBirthDay`];
  const dateOfBirthMonth = formData[`participants[${participantIndex}].customer.dateOfBirthMonth`];
  const dateOfBirthYear  = formData[`participants[${participantIndex}].customer.dateOfBirthYear`];
  const dob = new Date(Number(dateOfBirthYear), Number(dateOfBirthMonth) - 1, Number(dateOfBirthDay));

  validateDob({
    field: `participants[${participantIndex}].customer.dateOfBirth`,
    dob: dob,
    eventDate: eventDate,
    minAge: minAge,
    maxAge: maxAge,
    message: message,
    errors: errors,
  });
}


// TODO: Move into shared...

function validateDob({ field, dob, eventDate, minAge, maxAge, message, errors }) {
  if (minAge && eventDate) {
    const turnsMinAge = new Date(dob.getFullYear() + minAge, dob.getMonth(), dob.getDate());
    if (turnsMinAge > eventDate) {
      errors.push({ 'field': field, 'message': message });
    }
  }

  if (maxAge && eventDate) {
    const turnsMaxAge = new Date(dob.getFullYear() + maxAge, dob.getMonth(), dob.getDate());
    if (turnsMaxAge < eventDate) {
      errors.push({ 'field': field, 'message': message });
    }
  }
}
