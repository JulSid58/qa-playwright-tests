import { test, expect, request } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV, API_VERSION } from '../Api_tests/env.js';

const baseURL = ENVIRONMENTS[CURRENT_ENV];

async function newCleanApi() {
  return await request.newContext({
    storageState: undefined,
    extraHTTPHeaders: {
      Accept: 'application/json'
    }
  });
}


// ---------------------------
// WITHOUT TOKEN
// ---------------------------

test('Subscriptions without token', async () => {

  const api = await newCleanApi();

  const response = await api.get(`${baseURL}/api/${API_VERSION}/subscriptions`);

  console.log("WITHOUT TOKEN STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// INVALID TOKEN
// ---------------------------

test('Subscriptions with invalid token', async () => {

  const api = await newCleanApi();

  const response = await api.get(`${baseURL}/api/${API_VERSION}/subscriptions`, {
    headers: {
      Authorization: 'Bearer invalid_token'
    }
  });

  console.log("INVALID TOKEN STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// EMPTY TOKEN
// ---------------------------

test('Subscriptions with empty token', async () => {

  const api = await newCleanApi();

  const response = await api.get(`${baseURL}/api/${API_VERSION}/subscriptions`, {
    headers: {
      Authorization: 'Bearer '
    }
  });

  console.log("EMPTY TOKEN STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// MALFORMED TOKEN
// ---------------------------

test('Subscriptions with malformed token', async () => {

  const api = await newCleanApi();

  const response = await api.get(`${baseURL}/api/${API_VERSION}/subscriptions`, {
    headers: {
      Authorization: 'Bearer !!!@@@###'
    }
  });

  console.log("MALFORMED TOKEN STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// WRONG AUTH HEADER
// ---------------------------

test('Subscriptions with wrong auth header', async () => {

  const api = await newCleanApi();

  const response = await api.get(`${baseURL}/api/${API_VERSION}/subscriptions`, {
    headers: {
      Authorization: 'Basic 123456'
    }
  });

  console.log("WRONG AUTH HEADER STATUS:", response.status());

  expect(response.status()).toBe(401);

});


// ---------------------------
// WRONG HTTP METHODS
// ---------------------------

test('Subscriptions wrong HTTP methods', async () => {

  const api = await newCleanApi();

  const responses = [];

  responses.push(await api.post(`${baseURL}/api/${API_VERSION}/subscriptions`));
  responses.push(await api.put(`${baseURL}/api/${API_VERSION}/subscriptions`));
  responses.push(await api.patch(`${baseURL}/api/${API_VERSION}/subscriptions`));
  responses.push(await api.delete(`${baseURL}/api/${API_VERSION}/subscriptions`));

  const statuses = responses.map(r => r.status());

  console.log("METHOD STATUSES:", statuses);

  statuses.forEach(status => {
    expect(status).not.toBe(200);
    expect(status).not.toBe(500);
  });

});


// ---------------------------
// INVALID QUERY PARAM
// ---------------------------

test('Subscriptions with invalid query params', async () => {

  const api = await newCleanApi();

  const response = await api.get(`${baseURL}/api/${API_VERSION}/subscriptions?invalid_param=test`);

  console.log("INVALID PARAM STATUS:", response.status());

  expect(response.status()).not.toBe(500);

});


// ---------------------------
// VERY LONG QUERY PARAM
// ---------------------------

test('Subscriptions very long query param', async () => {

  const api = await newCleanApi();

  const longParam = "A".repeat(5000);

  const response = await api.get(`${baseURL}/api/${API_VERSION}/subscriptions?test=${longParam}`);

  console.log("LONG PARAM STATUS:", response.status());

  expect(response.status()).not.toBe(500);

});