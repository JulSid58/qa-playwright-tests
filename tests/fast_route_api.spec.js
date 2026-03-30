import { test, expect } from '@playwright/test';
import { ENVIRONMENTS, CURRENT_ENV } from '../Api_tests/env.js';
import { login } from '../helpers/login.js';

const API_VERSION = "v3";

test(`Fast route API ${API_VERSION}`, async ({ request }) => {

  const baseURL = ENVIRONMENTS[CURRENT_ENV];

  // --- LOGIN ---
  const token = await login(request);

  console.log("TOKEN:", token);

  // --- FAST ROUTE ---
  const response = await request.post(`${baseURL}/api/${API_VERSION}/fast-route`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    },
    params: {
      ip: "8.8.8.8"
    }
  });

  const status = response.status();
  console.log("STATUS:", status);

  expect(status).toBe(200);

  const body = await response.json();

  console.log("FAST ROUTE RESPONSE:");
  console.log(JSON.stringify(body, null, 2));

  // --- ПРОВЕРКИ ---

  expect(body).toHaveProperty('result');

  const servers = body.result;

  expect(Array.isArray(servers)).toBeTruthy();
  expect(servers.length).toBeGreaterThan(0);

  const server = servers[0];

  expect(server).toHaveProperty('distance');
  expect(server).toHaveProperty('country');
  expect(server).toHaveProperty('country_code');
  expect(server).toHaveProperty('city');
  expect(server).toHaveProperty('address');
  expect(server).toHaveProperty('port');
  expect(server).toHaveProperty('protocol');

  // проверки типов
  expect(typeof server.distance).toBe('number');
  expect(typeof server.country).toBe('string');
  expect(typeof server.country_code).toBe('string');
  expect(typeof server.city).toBe('string');
  expect(typeof server.address).toBe('string');
  expect(typeof server.port).toBe('number');
  expect(typeof server.protocol).toBe('string');

});