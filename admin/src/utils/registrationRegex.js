export const fullNameRegex = /^[A-Za-z]+(?: [A-Za-z'-]+){1,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const usernameRegex = /^(?![0-9])([A-Za-z0-9_]{3,15})$/;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
