import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

test(`Logout API v${API_VERSION}`, async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  // --- SIGN IN ---
  const loginResponse = await request.post(`${baseURL}/api/${API_VERSION}/sign-in`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      email: "ysidorova58@gmail.com",
      password: "123456"
    }
  });

  expect(loginResponse.status()).toBe(200);

  const loginBody = await loginResponse.json();
  const token = loginBody.access_token;

  console.log("TOKEN:", token);

  // --- LOGOUT ---
  const logoutResponse = await request.post(`${baseURL}/api/${API_VERSION}/logout`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  const logoutBody = await logoutResponse.json();

  console.log("LOGOUT RESPONSE:", logoutBody);

  expect(logoutResponse.status()).toBe(200);

});