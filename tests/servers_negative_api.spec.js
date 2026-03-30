import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

test('Servers without token', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const response = await request.post(`${baseURL}/api/${API_VERSION}/servers`, {
    headers: {
      Accept: 'application/json'
    },
    data: {
      currentVersion: "1"
    }
  });

  console.log("STATUS:", response.status());

  expect(response.status()).toBe(401);

});


test('Servers with wrong token', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const response = await request.post(`${baseURL}/api/${API_VERSION}/servers`, {
    headers: {
      Authorization: `Bearer wrong_token`,
      Accept: 'application/json'
    },
    data: {
      currentVersion: "1"
    }
  });

  console.log("STATUS:", response.status());

  expect(response.status()).toBe(401);

});


import { login } from '../helpers/login.js';

test('Servers without currentVersion', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const token = await login(request);

  const response = await request.post(`${baseURL}/api/${API_VERSION}/servers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  console.log("STATUS:", response.status());

  expect(response.status()).toBe(422);

});