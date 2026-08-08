const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]*$/;
const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const AGE_REGEX = /^\d+$/;
const PHONE_REGEX = /^\d{10}$/;
const DOB_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isRequired(value) {
  return String(value ?? '').trim() !== '';
}

export function isValidName(name) {
  const value = String(name ?? '').trim();
  if (!value) {
    return false;
  }

  return NAME_REGEX.test(value);
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email ?? ''));
}

export function isValidAge(age) {
  const value = String(age ?? '').trim();
  if (!AGE_REGEX.test(value)) {
    return false;
  }

  const numericAge = Number(value);
  return numericAge >= 1 && numericAge < 60;
}

export function isValidPhone(phone) {
  return PHONE_REGEX.test(String(phone ?? '').trim());
}

export function isValidDob(dob) {
  const value = String(dob ?? '').trim();
  if (!DOB_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function getNameError(name) {
  if (!isRequired(name)) {
    return 'Name is required.';
  }

  if (!isValidName(name)) {
    return 'Name must start with a letter and can contain spaces, hyphens, apostrophes, or periods.';
  }

  return '';
}

export function getEmailError(email) {
  if (!isRequired(email)) {
    return 'Email is required.';
  }

  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }

  return '';
}

export function getAgeError(age) {
  if (!isRequired(age)) {
    return 'Age is required.';
  }

  if (!isValidAge(age)) {
    return 'Age must be a number from 1 to 59.';
  }

  return '';
}

export function getPhoneError(phone) {
  if (!isRequired(phone)) {
    return 'Phone number is required.';
  }

  if (!isValidPhone(phone)) {
    return 'Phone number must contain exactly 10 digits.';
  }

  return '';
}

export function getDobError(dob) {
  if (!isRequired(dob)) {
    return 'Date of birth is required.';
  }

  if (!isValidDob(dob)) {
    return 'Date of birth must be in YYYY-MM-DD format.';
  }

  return '';
}

export function getRequiredError(value, fieldLabel) {
  return isRequired(value) ? '' : `${fieldLabel} is required.`;
}

export function getConfirmPasswordError(password, confirmPassword) {
  if (!isRequired(confirmPassword)) {
    return 'Confirm password is required.';
  }

  if (String(password ?? '') !== String(confirmPassword ?? '')) {
    return 'Passwords do not match.';
  }

  return '';
}