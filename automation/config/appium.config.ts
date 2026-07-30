import path from 'path';

export const AppiumConfig = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: '/',
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
    'appium:platformVersion': process.env.ANDROID_VERSION || '14.0',
    'appium:app': process.env.APK_PATH || path.join(__dirname, '../../app/build/outputs/apk/debug/app-debug.apk'),
    'appium:appPackage': 'com.simats.smartcareerpath',
    'appium:appActivity': 'com.simats.smartcareerpath.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
    'appium:autoGrantPermissions': true,
    'appium:uiautomator2ServerInstallTimeout': 60000
  },
  timeouts: {
    implicitWait: 10000,
    explicitWait: 15000,
    pageLoad: 30000
  }
};
