import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  private nameInput = 'id:profile_name';
  private emailInput = 'id:profile_email';
  private saveBtn = 'id:save_profile';
  private logoutBtn = 'id:logout_button';

  async updateName(name: string) {
    await this.sendKeys(this.nameInput, name, 'Profile Name Input');
  }

  async saveProfile() {
    await this.click(this.saveBtn, 'Save Profile Button');
  }

  async logout() {
    await this.click(this.logoutBtn, 'Logout Button');
  }
}
