import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV } from '../Api_tests/env.js';

const API_VERSION = "v3";
const baseURL = ENVIRONMENTS[CURRENT_ENV];


// ---------------------------
// WITHOUT TOKEN
// ---------------------------

test('Fast route without token', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Accept: 'application/json'
    },
    params: {
      ip: "8.8.8.8"
    }
  });

  console.log("WITHOUT TOKEN STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// WRONG TOKEN
// ---------------------------

test('Fast route with wrong token', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Authorization: `Bearer wrong_token`,
      Accept: 'application/json'
    },
    params: {
      ip: "8.8.8.8"
    }
  });

  console.log("WRONG TOKEN STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// EMPTY TOKEN
// ---------------------------

test('Fast route with empty token', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Authorization: `Bearer `,
      Accept: 'application/json'
    },
    params: {
      ip: "8.8.8.8"
    }
  });

  console.log("EMPTY TOKEN STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// WITHOUT IP
// ---------------------------

test('Fast route without ip', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Accept: 'application/json'
    }
  });

  console.log("WITHOUT IP STATUS:", response.status());

  expect(response.status()).toBe(422);

});


// ---------------------------
// EMPTY IP
// ---------------------------

test('Fast route empty ip', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Accept: 'application/json'
    },
    params: {
      ip: ""
    }
  });

  console.log("EMPTY IP STATUS:", response.status());

  expect(response.status()).toBe(422);

});


// ---------------------------
// INVALID IP
// ---------------------------

test('Fast route invalid ip', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Accept: 'application/json'
    },
    params: {
      ip: "abc"
    }
  });

  console.log("INVALID IP STATUS:", response.status());

  expect(response.status()).toBe(422);

});


// ---------------------------
// WRONG IP FORMAT
// ---------------------------

test('Fast route wrong ip format', async ({ request }) => {

  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Accept: 'application/json'
    },
    params: {
      ip: "999.999.999.999"
    }
  });

  console.log("WRONG IP STATUS:", response.status());

  expect(response.status()).toBe(422);

});


// ---------------------------
// WRONG HTTP METHODS
// ---------------------------

test('Fast route wrong HTTP methods', async ({ request }) => {

  const responses = [];

  responses.push(await request.get(`${baseURL}/api/${API_VERSION}/fast-route`));
  responses.push(await request.put(`${baseURL}/api/${API_VERSION}/fast-route`));
  responses.push(await request.patch(`${baseURL}/api/${API_VERSION}/fast-route`));
  responses.push(await request.delete(`${baseURL}/api/${API_VERSION}/fast-route`));

  const statuses = responses.map(r => r.status());

  console.log("METHOD STATUSES:", statuses);

  statuses.forEach(status => {
    expect(status).not.toBe(200);
    expect(status).not.toBe(500);
  });

});