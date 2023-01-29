import http from "./httpService";

const apiEndpoint = "http://localhost:3900/api/employers";

export function register(employer) {
  return http.post(apiEndpoint, {
    email: employer.email,
    password: employer.password,
    passwordRepeat: employer.passwordRepeat,
    name: employer.name,
    surname: employer.surname,
    date: employer.date,
  });
}
