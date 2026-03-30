import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

test.describe(`Sign in negative API v${API_VERSION}`, () => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  const testCases = [

    {
      name: "Wrong password",
      body: {
        email: "ysidorova58@gmail.com",
        password: "wrong_password"
      },
      expectedStatus: 422
    },

    {
      name: "Email does not exist",
      body: {
        email: "autotest_not_exist@gmail.com",
        password: "123456"
      },
      expectedStatus: 422
    },

    {
      name: "Empty email",
      body: {
        email: "",
        password: "123456"
      },
      expectedStatus: 422
    },

    {
      name: "Empty password",
      body: {
        email: "ysidorova58@gmail.com",
        password: ""
      },
      expectedStatus: 422
    },

    {
      name: "Empty body",
      body: {},
      expectedStatus: 422
    }

  ];

  for (const caseData of testCases) {

    test(caseData.name, async ({ request }) => {

      const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-in`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: caseData.body
      });

      console.log("TEST:", caseData.name);
      console.log("STATUS:", response.status());

      expect(response.status()).toBe(caseData.expectedStatus);

    });

  }

});