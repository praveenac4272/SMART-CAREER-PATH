import fs from 'fs';
import path from 'path';

export class ScreenshotUtils {
  private static screenshotDir = path.join(process.cwd(), 'screenshots');

  public static ensureDir() {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  public static captureScreenshot(driver: any, testId: string): string {
    this.ensureDir();
    const timestamp = Date.now();
    const fileName = `${testId}_${timestamp}.png`;
    const filePath = path.join(this.screenshotDir, fileName);

    try {
      if (driver && typeof driver.takeScreenshot === 'function') {
        const screenshotBase64 = driver.takeScreenshot();
        fs.writeFileSync(filePath, Buffer.from(screenshotBase64, 'base64'));
        return fileName;
      }
    } catch (err) {
      console.error(`Failed to capture screenshot for ${testId}:`, err);
    }
    
    // Create dummy 1x1 base64 png if driver capture unavailable
    const dummyPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    fs.writeFileSync(filePath, Buffer.from(dummyPng, 'base64'));
    return fileName;
  }
}
