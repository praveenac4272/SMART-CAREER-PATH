import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private headerTitle = 'id:home_header';
  private exploreDomainsCard = 'id:explore_domains';
  private assessmentCard = 'id:take_assessment';
  private profileIcon = 'id:profile_icon';

  async isHeaderVisible(): Promise<boolean> {
    return this.isDisplayed(this.headerTitle);
  }

  async clickExploreDomains() {
    await this.click(this.exploreDomainsCard, 'Explore Domains Card');
  }

  async clickAssessment() {
    await this.click(this.assessmentCard, 'Take Assessment Card');
  }

  async clickProfile() {
    await this.click(this.profileIcon, 'Profile Navigation Icon');
  }
}
