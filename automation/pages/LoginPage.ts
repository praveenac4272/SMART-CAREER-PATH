import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private emailInput = 'id:email_input';
  private passwordInput = 'id:password_input';
  private loginBtn = 'id:login_button';
  private forgotPasswordBtn = 'id:forgot_password';
  private signUpLink = 'id:signup_link';

  async enterEmail(email: string) {
    await this.sendKeys(this.emailInput, email, 'Email Field');
  }

  async enterPassword(password: string) {
    await this.sendKeys(this.passwordInput, password, 'Password Field');
  }

  async clickLogin() {
    await this.click(this.loginBtn, 'Login Button');
  }

  async clickForgotPassword() {
    await this.click(this.forgotPasswordBtn, 'Forgot Password Link');
  }

  async clickSignUp() {
    await this.click(this.signUpLink, 'Sign Up Link');
  }
}
