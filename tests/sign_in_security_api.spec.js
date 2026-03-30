import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

const baseURL = ENVIRONMENTS[CURRENT_ENV];

const injectionCases = [

  {
    name: "SQL injection in email",
    body: {
      email: "' OR 1=1 --",
      password: "123456"
    }
  },

  {
    name: "SQL injection in password",
    body: {
      email: "ysidorova58@gmail.com",
      password: "' OR 1=1 --"
    }
  },

  {
    name: "XSS in email",
    body: {
      email: "<script>alert(1)</script>",
      password: "123456"
    }
  },

  {
    name: "XSS in password",
    body: {
      email: "ysidorova58@gmail.com",
      password: "<script>alert(1)</script>"
    }
  },

  {
    name: "SQL DROP attempt",
    body: {
      email: "'; DROP TABLE users; --",
      password: "123456"
    }
  },

  {
    name: "Command injection",
    body: {
      email: "test@test.com; rm -rf /",
      password: "123456"
    }
  },

  {
    name: "Path traversal payload",
    body: {
      email: "../../../../etc/passwd",
      password: "123456"
    }
  }

];

for (const caseData of injectionCases) {

  test(caseData.name, async ({ request }) => {

    const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-in`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: caseData.body
    });

    const status = response.status();

    console.log("TEST:", caseData.name);
    console.log("STATUS:", status);

    // API не должен падать
    expect(status).not.toBe(500);

  });

}