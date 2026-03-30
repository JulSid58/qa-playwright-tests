import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

export async function login(request) {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-in`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      email: "ysidorova58@gmail.com",
      password: "123456"
    }
  });

  const body = await response.json();

  return body.access_token;
}