const Page = require('./page');

const modalName = async(page) => {
  await page.waitForSelector('#name');
  const name_handle = await page.$('#name');
  const current = new Date();
  await name_handle.type(` - ${current.getFullYear()}.${(current.getMonth() + 1).toString().padStart(2, '0')}.${current.getDate().toString().padStart(2, '0')} - ${current.getHours().toString().padStart(2, '0')}.${current.getMinutes().toString().padStart(2, '0')}.${current.getSeconds().toString().padStart(2, '0')}`);
  const button_handle = await page.$('.ant-modal-footer button.ant-btn-primary');
  await button_handle.click();
};
const modalPublish = async(page) => {
  const selector = '.ant-modal-footer button.ant-btn-primary';
  await page.waitForSelector(selector);
  const button_handle = await page.$(selector);
  await button_handle.click();
};

class NewTemplatePage extends Page {
  constructor(page) {
    super(page);
    page.on('requestfinished', request => {
      if(request.url().includes('/settings') && request.method() === 'POST') {
        const split = request.url().split('/settings')[0].split('/');
        this.id = split[split.length-1];
      }
    });
  }

  async createDraft() {
    await this.page.waitForSelector('.strategyTile');
    const modal_handles = await this.page.$$('.strategyTile');
    const button_handle = await modal_handles[1].$('button');
    await Promise.all([
      this.page.waitForNavigation({waitUntil: ['networkidle0']}),
      await button_handle.click(),
      await modalName(this.page),
    ]);
  }

  async changeCTAButtonColor() {
    // const tabs = await this.page.$$eval('[role="tab"]', element => element.textContent);
    // console.log('tabs: ', tabs)

    // await this.page.select('[id="cta_button[color]"', 'Blue');
    const color_handle = await this.page.$('[id="cta_button[color]"');
    await color_handle.click();

    const menuItems = await this.page.$$('li.ant-select-dropdown-menu-item');
    for(let i=0; i<menuItems.length; i++) {
      const textContent = await this.page.evaluate(e => e.textContent, menuItems[i]);
      if(textContent.trim().toLowerCase() === 'blue') {
        await menuItems[i].click();
        break;
      }
    }

    // const length = await this.page.$$eval('li.ant-select-dropdown-menu-item', elements => elements[1].innerText);
    //
    //
    // await this.page.$$eval('li.ant-select-dropdown-menu-item', elements => {
    //   for(let i=0; i<elements.length; i++) {
    //     console.log(`${i}: ${elements[i]}`);
    //   }
    // });

    // ant-select-dropdown-menu-item"


  }
  async selectBehaviorTab() {
    const tabs = await this.page.$$('[role="tab"]');
    for(let i=0; i<tabs.length; i++) {
      const textContent = await this.page.evaluate(e => e.textContent, tabs[i]);
      if(textContent.trim().toLowerCase() === 'behavior') {
        await tabs[i].click();
        break;
      }
    }

    // const length = await this.page.$$eval('li.ant-select-dropdown-menu-item', elements => elements[1].innerText);
    //
    //
    // await this.page.$$eval('li.ant-select-dropdown-menu-item', elements => {
    //   for(let i=0; i<elements.length; i++) {
    //     console.log(`${i}: ${elements[i]}`);
    //   }
    // });

    // ant-select-dropdown-menu-item"


  }
  async changeAutomaticallyOpen() {
    const rule = await this.page.$('.rule-ctr');
    rule.click();


    //li.ant-dropdown-menu-item[role="menuitem"]'
    const selector = 'li.ant-dropdown-menu-item[role="menuitem"]';
    await this.page.waitForSelector(selector);
    const dropdownItems = await this.page.$$(selector);
    for(let i=0; i<dropdownItems.length; i++) {
      const textContent = await this.page.evaluate(e => e.textContent, dropdownItems[i]);
      // console.log(textContent.trim().toLowerCase())
      if(textContent.trim().toLowerCase() === 'do not automatically open') {
        await dropdownItems[i].click();
        break;
      }
    }


  }
  async save() {
    const buttons = await this.page.$$('button.ant-btn-primary');
    for(let i=0; i<buttons.length; i++) {
      const textContent = await this.page.evaluate(e => e.textContent, buttons[i]);
      if(textContent.trim().toLowerCase() === 'save') {
        await buttons[i].click();
        // ant-message-custom-content ant-message-success
        await this.page.waitForSelector('.ant-message-success');
        break;
      }
    }


  }
  async continue() {
    const buttons = await this.page.$$('button.ant-btn-primary');
    for(let i=0; i<buttons.length; i++) {
      const textContent = await this.page.evaluate(e => e.textContent, buttons[i]);
      if(textContent.trim().toLowerCase() === 'continue') {
        await buttons[i].click();
        break;
      }
    }


  }
  async publish() {
    const buttons = await this.page.$$('button.ant-btn-primary');
    for(let i=0; i<buttons.length; i++) {
      const textContent = await this.page.evaluate(e => e.textContent, buttons[i]);
      if(textContent.trim().toLowerCase() === 'publish') {
        await Promise.all([
          this.page.waitForNavigation({waitUntil: ['networkidle0']}),
          await buttons[i].click(),
          await modalPublish(this.page),
        ]);
        break;
      }
    }
  }
}

module.exports = NewTemplatePage;

