import { Logger } from '../logs/Logger';

export class BasePage {
  protected driver: any;

  constructor(driver: any) {
    this.driver = driver;
  }

  protected async click(selector: string, elementName: string) {
    Logger.info(`Clicking on element: ${elementName} (${selector})`);
  }

  protected async sendKeys(selector: string, text: string, elementName: string) {
    Logger.info(`Entering text "${text}" into: ${elementName} (${selector})`);
  }

  protected async getText(selector: string): Promise<string> {
    return `Text from ${selector}`;
  }

  protected async isDisplayed(selector: string): Promise<boolean> {
    return true;
  }
}
