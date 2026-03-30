import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

test('Plan without token', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const response = await request.get(`${baseURL}/api/${API_VERSION}/plan`, {
    headers: {
      Accept: 'application/json'
    },
    params: {
      local: 'en'
    }
  });

  console.log("STATUS:", response.status());

  expect(response.status()).toBe(401);

});


test('Plan with wrong token', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const response = await request.get(`${baseURL}/api/${API_VERSION}/plan`, {
    headers: {
      Authorization: `Bearer wrong_token`,
      Accept: 'application/json'
    },
    params: {
      local: 'en'
    }
  });

  console.log("STATUS:", response.status());

  expect(response.status()).toBe(401);

});


test('Plan with empty token', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const response = await request.get(`${baseURL}/api/${API_VERSION}/plan`, {
    headers: {
      Authorization: `Bearer `,
      Accept: 'application/json'
    },
    params: {
      local: 'en'
    }
  });

  console.log("STATUS:", response.status());

  expect(response.status()).toBe(401);

});