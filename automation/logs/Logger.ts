import fs from 'fs';
import path from 'path';

export class Logger {
  private static logDir = path.join(process.cwd(), 'logs');
  private static logFile = path.join(Logger.logDir, 'execution.log');

  private static ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  public static info(message: string) {
    this.log('INFO', message);
  }

  public static warn(message: string) {
    this.log('WARN', message);
  }

  public static error(message: string, error?: any) {
    let msg = message;
    if (error && error.stack) {
      msg += `\nStack trace: ${error.stack}`;
    } else if (error) {
      msg += `\nDetails: ${JSON.stringify(error)}`;
    }
    this.log('ERROR', msg);
  }

  public static debug(message: string) {
    this.log('DEBUG', message);
  }

  private static log(level: string, message: string) {
    this.ensureLogDir();
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    console.log(formattedMessage);
    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    } catch (e) {
      // Fallback
    }
  }

  public static getLogContent(): string {
    if (fs.existsSync(this.logFile)) {
      return fs.readFileSync(this.logFile, 'utf-8');
    }
    return '';
  }
}
