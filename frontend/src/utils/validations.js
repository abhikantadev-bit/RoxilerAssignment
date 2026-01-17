// Validation rules matching backend specifications
export const validateEmail = (email) => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    password.length <= 16 &&
    /[A-Z]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};

export const validateName = (name) => {
  return name.length >= 20 && name.length <= 60;
};

export const validateAddress = (address) => {
  return address.length <= 400;
};

export const validateRating = (rating) => {
  return rating >= 1 && rating <= 5;
};
