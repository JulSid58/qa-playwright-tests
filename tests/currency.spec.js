import { test, expect } from '@playwright/test';

test('RU locale shows ruble prices in tariffs', async ({ page }) => {

  // открываем русскую версию сайта
  await page.goto('https://site.stage.infra.gnuvpn.com/ru', {
    waitUntil: 'domcontentloaded'
  });

  // ждём загрузки блока тарифов
  const tariffsBlock = page.locator('.tariffsSection__tariffs');
  await expect(tariffsBlock).toBeVisible();

  // находим все цены
  const prices = page.locator('.tariffBanner__priceCurrent');

  // проверяем что хотя бы одна цена содержит ₽
  const rubPrices = page.locator('.tariffBanner__priceCurrent:has-text("₽")');

  const rubCount = await rubPrices.count();

  expect(rubCount).toBeGreaterThan(0);

});