import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

test('10 sequential sign-ups', async ({ request }) => {

  test.setTimeout(120000);

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  for (let i = 0; i < 10; i++) {

    const email = `autotest.${Date.now()}.${i}@gmail.com`;

    const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-device-id': 'autotest-device',
        'User-Agent': 'GnuVpn Android'
      },
      data: {
        email: email,
        password: "Test1234",
        password_confirmation: "Test1234",
        anonim: false,
        ref: "test_ref",
        push_token: "test_push_token",
        locale: "en"
      }
    });

    const status = response.status();
    const text = await response.text();

    console.log("EMAIL:", email);
    console.log("STATUS:", status);
    console.log("BODY:", text);

    expect(status).toBe(200);

  }

});