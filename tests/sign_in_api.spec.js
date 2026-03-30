import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

test('Sign in API', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-in`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      email: 'ysidorova58@gmail.com',
      password: '123456'
    }
  });

  const status = response.status();
  console.log("STATUS:", status);

  expect(status).toBe(200);

  const body = await response.json();

  console.log("SIGN IN RESPONSE:");
  console.log(JSON.stringify(body, null, 2));

  // --- ПРОВЕРКА СТРУКТУРЫ ОТВЕТА ---

  expect(body).toHaveProperty('access_token');
  expect(body).toHaveProperty('token_type');
  expect(body).toHaveProperty('email_verified');
  expect(body).toHaveProperty('is_reg_anon');
  expect(body).toHaveProperty('user_id');

  // --- ПРОВЕРКА ЗНАЧЕНИЙ ---

  expect(body.token_type).toBe('Bearer');

  // --- ПРОВЕРКА ТИПОВ ДАННЫХ ---

  expect(typeof body.access_token).toBe('string');
  expect(typeof body.email_verified).toBe('boolean');
  expect(typeof body.is_reg_anon).toBe('boolean');
  expect(typeof body.user_id).toBe('number');

  // --- ДОПОЛНИТЕЛЬНЫЕ ПРОВЕРКИ ---

  // токен не должен быть пустым
  expect(body.access_token.length).toBeGreaterThan(10);

  // user_id должен быть > 0
  expect(body.user_id).toBeGreaterThan(0);

});