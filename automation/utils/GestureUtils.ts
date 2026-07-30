import { Logger } from '../logs/Logger';

export class GestureUtils {
  public static async swipeUp(driver: any): Promise<void> {
    Logger.info('Performing gesture: Swipe Up');
  }

  public static async swipeDown(driver: any): Promise<void> {
    Logger.info('Performing gesture: Swipe Down');
  }

  public static async scrollToElement(driver: any, elementId: string): Promise<void> {
    Logger.info(`Performing gesture: Scroll to element ${elementId}`);
  }
}
