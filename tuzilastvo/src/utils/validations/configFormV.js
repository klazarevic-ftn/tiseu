export const isFormValid = (formData, isSecondForm) => {
  const {
    firstName,
    lastName,
    UPIN,
    dateOfBirth,
    streetAddress,
    aptNumber,
    city,
    country,
    phone
  } = formData;

  if (
    !firstName ||
    !lastName ||
    !UPIN ||
    !dateOfBirth ||
    !streetAddress ||
    !aptNumber ||
    !city ||
    !country ||
    !phone
  ) {
    return "Please fill in all fields.";
  }

  const nameRegex = /^[A-Za-z]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return "First name and last name should contain only letters.";
  }

  if (UPIN.length !== 13 || isNaN(UPIN)) {
    return "UPIN should be exactly 13 digits.";
  }

  // const currentYear = new Date().getFullYear();
  // if (yearOfBirth > currentYear - 18) {
  //   return "You must be at least 18 years old.";
  // }

  // const daysInMonth = new Date(yearOfBirth, monthOfBirth, 0).getDate();
  // if (dayOfBirth < 1 || dayOfBirth > daysInMonth) {
  //   return "Invalid date of birth.";
  // }

  // Validate date format
  const dateFormatRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/; // Assuming MM/DD/YYYY format
  if (!dateFormatRegex.test(dateOfBirth)) {
    return "Date of birth should be in DD MM YYYY format.";
  }

  const currentDate = new Date();
  const [day, month, year] = dateOfBirth.split(' ');
  const selectedDate = new Date(`${year}-${month}-${day}`);
  if (selectedDate >= currentDate) {
    return "Date of birth cannot be in the future.";
  }

  // Validate date of birth
  // const selectedDate = new Date(dateOfBirth);
  // if (selectedDate >= currentDate) {
  //   return "Date of birth cannot be in the future.";
  // }

  const streetRegex = /^[A-Za-z0-9\s]+$/;
  if (!streetRegex.test(streetAddress)) {
    return "Street address should contain only letters, numbers, and spaces.";
  }

  const cityRegex = /^[A-Za-z\s]+$/;
  if (!cityRegex.test(city)) {
    return "City should contain only letters and spaces.";
  }

  const countryRegex = /^[A-Za-z\s]+$/;
  if (!countryRegex.test(country)) {
    return "Country should contain only letters and spaces.";
  }


  const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(phone)) {
    return "Phone number should contain only digits.";
  }

  if (isSecondForm) {
    const { specialization, license } = formData;
    if (!specialization || !license) {
      return "Please fill in all fields.";
    }
  }

  return true;
};
