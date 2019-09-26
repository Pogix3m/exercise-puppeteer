const Page = require('./page');

class DashboardPage extends Page {
  constructor(page) {
    super(page);
  }

  async selectGrowthPluginsMenu() {
    const menuItems = await this.page.$$('.ant-menu-item[role="menuitem"]');
    for(let i=0; i<menuItems.length; i++) {
      const textContent = await this.page.evaluate(e => e.textContent, menuItems[i]);
      if(textContent.trim().toLowerCase() === 'growth plugins') {
        await Promise.all([
          this.page.waitForNavigation({waitUntil: ['networkidle0']}),
          await menuItems[i].click(),
        ]);
        break;
      }
    }


  }
}

module.exports = DashboardPage;
