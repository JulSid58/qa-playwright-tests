import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

const baseURL = ENVIRONMENTS[CURRENT_ENV];

// ---------------------------
// 10 PARALLEL SIGN UPS
// ---------------------------

test('Sign up race condition (10 parallel registrations)', async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const email = `race10_${Date.now()}@gmail.com`;

  const body = {
    email: email,
    password: "123456",
    password_confirmation: "123456",
    anonim: false,
    locale: "ru"
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // создаём 10 параллельных запросов
  const requests = Array.from({ length: 10 }, () =>
    request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      headers,
      data: body
    })
  );

  const responses = await Promise.all(requests);

  const statuses = responses.map(r => r.status());

  console.log("PARALLEL STATUSES:", statuses);

  // хотя бы один должен быть успешным
  expect(statuses).toContain(200);

  // API не должно падать
  statuses.forEach((status, i) => {
  console.log(`REQUEST ${i} STATUS:`, status);
  expect(status).not.toBe(500);
});

  // проверяем user_id
  const bodies = await Promise.all(responses.map(r => r.json()));
  const userIds = bodies.map(b => b.user_id).filter(Boolean);

  console.log("USER IDS:", userIds);

  // все user_id должны быть одинаковые
  const uniqueIds = [...new Set(userIds)];

  expect(uniqueIds.length).toBe(1);

});