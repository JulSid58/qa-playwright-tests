import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

test('Sign up API', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const email = `autotest_${Date.now()}@gmail.com`;

  const requestBody = {
    email: email,
    password: "123456",
    password_confirmation: "123456",
    anonim: false,
    ref: "12345",
    push_token: "push_tok_abc123",
    locale: "ru"
  };

  const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: requestBody
  });

  const status = response.status();
  console.log("STATUS:", status);

  expect(status).toBe(200);

  const body = await response.json();

  console.log("SIGN UP RESPONSE:");
  console.log(JSON.stringify(body, null, 2));

  // --- ПРОВЕРКА СТРУКТУРЫ ОТВЕТА ---

  expect(body).toHaveProperty('access_token');
  expect(body).toHaveProperty('token_type');
  expect(body).toHaveProperty('user_id');
  expect(body).toHaveProperty('password');

  // --- ПРОВЕРКА ЗНАЧЕНИЙ ---

  expect(body.token_type).toBe('Bearer');
  expect(typeof body.access_token).toBe('string');
  expect(typeof body.user_id).toBe('number');

  // --- ПРОВЕРКА ТОКЕНА ---

  expect(body.access_token.length).toBeGreaterThan(10);

  // --- ПРОВЕРКА PASSWORD ИЗ ОТВЕТА ---

  expect(body.password).toBe(requestBody.password);

});