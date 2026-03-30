import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

const baseURL = ENVIRONMENTS[CURRENT_ENV];

const injectionCases = [

  {
    name: "SQL injection email",
    body: {
      email: "' OR 1=1 --",
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "SQL DROP attempt",
    body: {
      email: "'; DROP TABLE users; --",
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "XSS email",
    body: {
      email: "<script>alert(1)</script>",
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "XSS password",
    body: {
      email: "test@gmail.com",
      password: "<script>alert(1)</script>",
      password_confirmation: "<script>alert(1)</script>"
    }
  },

  {
    name: "Command injection",
    body: {
      email: "test@test.com; rm -rf /",
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "Path traversal",
    body: {
      email: "../../../../etc/passwd",
      password: "123456",
      password_confirmation: "123456"
    }
  },

  {
    name: "HTML injection",
    body: {
      email: "<img src=x onerror=alert(1)>@gmail.com",
      password: "123456",
      password_confirmation: "123456"
    }
  }

];

for (const caseData of injectionCases) {

  test(caseData.name, async ({ request }) => {

    const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: caseData.body
    });

    const status = response.status();

    console.log(caseData.name);
    console.log("STATUS:", status);

    expect(status).not.toBe(500);

  });

}


// ---------------------------
// EMAIL ENUMERATION TEST
// ---------------------------

test('Email enumeration protection', async ({ request }) => {

  const existingEmail = "ysidorova58@gmail.com";
  const newEmail = `enum_${Date.now()}@gmail.com`;

  const body1 = {
    email: existingEmail,
    password: "123456",
    password_confirmation: "123456"
  };

  const body2 = {
    email: newEmail,
    password: "123456",
    password_confirmation: "123456"
  };

  const r1 = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, { data: body1 });
  const r2 = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, { data: body2 });

  const s1 = r1.status();
  const s2 = r2.status();

  console.log("ENUM STATUS EXISTING:", s1);
  console.log("ENUM STATUS NEW:", s2);

  expect(s1).not.toBe(500);
  expect(s2).not.toBe(500);

});


// ---------------------------
// MASS REGISTRATION TEST
// ---------------------------

test('Mass registration attempt', async ({ request }) => {

  const requests = Array.from({ length: 20 }, (_, i) => {

    const email = `mass_${Date.now()}_${i}@gmail.com`;

    return request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        email: email,
        password: "123456",
        password_confirmation: "123456",
        anonim: false,
        locale: "ru"
      }
    });

  });

  const responses = await Promise.all(requests);

  const statuses = responses.map(r => r.status());

  console.log("MASS REGISTRATION STATUSES:", statuses);

  statuses.forEach(status => {
    expect(status).not.toBe(500);
  });

});


// ---------------------------
// RATE LIMIT TEST
// ---------------------------

test('Rate limit test (rapid sign-ups)', async ({ request }) => {

  const statuses = [];

  for (let i = 0; i < 15; i++) {

    const email = `ratelimit_${Date.now()}_${i}@gmail.com`;

    const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        email: email,
        password: "123456",
        password_confirmation: "123456"
      }
    });

    statuses.push(response.status());

  }

  console.log("RATE LIMIT STATUSES:", statuses);

  statuses.forEach(status => {
    expect(status).not.toBe(500);
  });

});


// ---------------------------
// PASSWORD BRUTE FORCE SIMULATION
// ---------------------------

test('Password brute force simulation', async ({ request }) => {

  const email = `brute_${Date.now()}@gmail.com`;

  for (let i = 0; i < 10; i++) {

    const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        email: email,
        password: `wrong_pass_${i}`,
        password_confirmation: `wrong_pass_${i}`
      }
    });

    console.log("BRUTE FORCE ATTEMPT", i, response.status());

    expect(response.status()).not.toBe(500);

  }

});


// ---------------------------
// UNICODE BYPASS TEST
// ---------------------------

test('Unicode email bypass attempt', async ({ request }) => {

  const email = `unicode_тест_${Date.now()}@gmail.com`;

  const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
    data: {
      email: email,
      password: "123456",
      password_confirmation: "123456"
    }
  });

  console.log("UNICODE STATUS:", response.status());

  expect(response.status()).not.toBe(500);

});


// ---------------------------
// EMAIL NORMALIZATION ATTACK
// ---------------------------

test('Email normalization attack', async ({ request }) => {

  const emails = [
    "test@gmail.com",
    "test+spam@gmail.com",
    "test+123@gmail.com"
  ];

  const statuses = [];

  for (const email of emails) {

    const r = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
      data: {
        email: email,
        password: "123456",
        password_confirmation: "123456"
      }
    });

    statuses.push(r.status());

  }

  console.log("NORMALIZATION STATUSES:", statuses);

  statuses.forEach(status => {
    expect(status).not.toBe(500);
  });

});


// ---------------------------
// JSON INJECTION TEST
// ---------------------------

test('JSON injection attempt', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/sign-up`, {
    data: {
      email: { "$gt": "" },
      password: "123456",
      password_confirmation: "123456"
    }
  });

  console.log("JSON INJECTION STATUS:", response.status());

  expect(response.status()).not.toBe(500);

});