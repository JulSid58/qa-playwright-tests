import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';
import { login } from '../helpers/login.js';

test(`Plan API v${API_VERSION}`, async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  // --- LOGIN ---
  const token = await login(request);
  console.log("TOKEN:", token);

  // --- PLAN ---
  const planResponse = await request.get(`${baseURL}/api/${API_VERSION}/plan`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    },
    params: {
      local: 'en'
    }
  });

  const planStatus = planResponse.status();
  console.log("PLAN STATUS:", planStatus);

  expect(planStatus).toBe(200);

  const planBody = await planResponse.json();

  console.log("PLAN RESPONSE:");
  console.log(JSON.stringify(planBody, null, 2));

  // --- ПРОВЕРКИ ---

  // проверяем что ответ объект
  expect(typeof planBody).toBe('object');

  // проверяем основные поля плана
  expect(planBody).toHaveProperty('user_id');
  expect(planBody).toHaveProperty('tariff_id');
  expect(planBody).toHaveProperty('begins_at');
  expect(planBody).toHaveProperty('ends_at');
  expect(planBody).toHaveProperty('tariff_data');

  // проверяем структуру тарифа
  const tariff = planBody.tariff_data;

  expect(tariff).toHaveProperty('id');
  expect(tariff).toHaveProperty('name');
  expect(tariff).toHaveProperty('price');
  expect(tariff).toHaveProperty('duration');

  console.log("CURRENT PLAN:", tariff.name);
  console.log("DAYS LEFT:", planBody.days_left);

});