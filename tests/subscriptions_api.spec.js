import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';
import { login } from '../helpers/login.js';

test(`Subscriptions API v${API_VERSION}`, async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  // --- LOGIN ---
  const token = await login(request);
  console.log("TOKEN:", token);

  // --- SUBSCRIPTIONS ---
  const subscriptionsResponse = await request.get(`${baseURL}/api/${API_VERSION}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  const subscriptionsStatus = subscriptionsResponse.status();
  console.log("SUBSCRIPTIONS STATUS:", subscriptionsStatus);

  expect(subscriptionsStatus).toBe(200);

  const subscriptionsBody = await subscriptionsResponse.json();

  console.log("SUBSCRIPTIONS RESPONSE:");
  console.log(JSON.stringify(subscriptionsBody, null, 2));

  // --- ПРОВЕРКИ ---

  // проверяем что ответ массив
  expect(Array.isArray(subscriptionsBody)).toBeTruthy();

  // проверяем что массив не пустой
  expect(subscriptionsBody.length).toBeGreaterThan(0);

  console.log("SUBSCRIPTIONS COUNT:", subscriptionsBody.length);

  // проверяем структуру первой подписки
  const subscription = subscriptionsBody[0];

  expect(subscription).toHaveProperty('id');
  expect(subscription).toHaveProperty('user_id');
  expect(subscription).toHaveProperty('tariff_id');
  expect(subscription).toHaveProperty('begins_at');
  expect(subscription).toHaveProperty('ends_at');
  expect(subscription).toHaveProperty('tariff');

});