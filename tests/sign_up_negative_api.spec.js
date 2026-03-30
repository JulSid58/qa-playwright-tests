import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

const baseURL = ENVIRONMENTS[CURRENT_ENV];

const testCases = [

  {
    name: "Email already exists",
    body: {
      email: "ysidorova58@gmail.com",
      password: "123456",
      password_confirmation: "123456",
      anonim: false,
      locale: "ru"
    }
  },

  {
    name: "Empty email",
    body: {
      email: "",
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "Empty password",
    body: {
      email: "test@gmail.com",
      password: "",
      password_confirmation: ""
    }
  },

  {
    name: "Password mismatch",
    body: {
      email: "test@gmail.com",
      password: "123456",
      password_confirmation: "654321"
    }
  },

  {
    name: "Invalid email format",
    body: {
      email: "testgmail.com",
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "Very long email",
    body: {
      email: `${"a".repeat(260)}@gmail.com`,
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "Empty body",
    body: {}
  }

];

for (const caseData of testCases) {

  test(caseData.name, async ({ request }) => {

    const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: caseData.body
    });

    console.log(caseData.name);
    console.log("STATUS:", response.status());

    expect(response.status()).toBe(422);

  });

}

// ---------------------------
// RACE CONDITION TEST
// ---------------------------

test('Sign up race condition (double registration)', async ({ request }) => {

  const email = `race_${Date.now()}@gmail.com`;

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

  const [response1, response2] = await Promise.all([
    request.post(`${baseURL}/api/${API_VERSION}/sign-up`, { headers, data: body }),
    request.post(`${baseURL}/api/${API_VERSION}/sign-up`, { headers, data: body })
  ]);

  const status1 = response1.status();
  const status2 = response2.status();

  console.log("RACE STATUS 1:", status1);
  console.log("RACE STATUS 2:", status2);

  const body1 = await response1.json();
  const body2 = await response2.json();

  console.log("USER ID 1:", body1.user_id);
  console.log("USER ID 2:", body2.user_id);

  // хотя бы один должен быть успешным
  expect([status1, status2]).toContain(200);

  // если оба успешные — user_id должен быть одинаковый
  if (status1 === 200 && status2 === 200) {
    expect(body1.user_id).toBe(body2.user_id);
  }

});