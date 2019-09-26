const Page = require('./page');

class PluginsNewStrategyPage extends Page {
  constructor(page) {
    super(page);
  }

  async createModal() {
    // const url = await this.page.url();
    // await this.page.goto(url.replace('strategy', 'template/modal'), {waitUntil: ['networkidle0']});

    const card = await this.page.$('#root .ant-card');
    await Promise.all([
      this.page.waitForNavigation({waitUntil: ['networkidle0']}),
      await card.click()
    ]);
  }

}

module.exports = PluginsNewStrategyPage;
