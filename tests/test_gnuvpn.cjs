const { remote } = require('webdriverio');

async function runTest() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android',
      'appium:appPackage': 'com.gnu.vpn',
      'appium:appActivity': 'com.gnu.vpn.AppActivity',
      'appium:noReset': true
    }
  });

  console.log("App launched successfully");

  await driver.pause(5000);

  await driver.deleteSession();
}

runTest();