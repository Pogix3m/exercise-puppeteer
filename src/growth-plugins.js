const Page = require('./page');

class GrowthPluginsPage extends Page {
  constructor(page) {
    super(page);
  }

  async create() {
    const selector = '#root button.ant-btn-primary';
    await this.page.waitForSelector(selector);
    const button = await this.page.$(selector);
    await Promise.all([
      this.page.waitForNavigation({waitUntil: ['networkidle0']}),
      await button.click()
    ]);
  }

  async toggle(pluginId) {
    // console.log('plugin: ', pluginId);
    const selector = `[data-row-key="plugin-${pluginId}"]`;
    await this.page.waitForSelector(selector, 60000);
    const toggle = await this.page.$(`${selector} .ant-switch-checked`);
    // console.log('toggle: ', !!toggle)
    if(toggle) {
      // console.log('clicked');
      await toggle.click();
    }
  }

}

module.exports = GrowthPluginsPage;
