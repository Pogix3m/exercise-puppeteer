const Page = require('./page');

const checkError = async page => {
  const url = await page.url();
  if(url.includes('login')) {
    const selector = '.auth0-global-message-error';
    await page.waitForSelector(selector);
    const error = await page.$(selector);
    const errorMessage = await page.evaluate(e => e.textContent || e.innerText, error);
    if (errorMessage) {
      throw errorMessage;
    }

    throw 'Invalid Email or Password';
  }
  return null;
};


class LoginPage extends Page {
  constructor(page) {
    super(page);
  }

  async setCredential(username='', password='') {
    const email_handle = await this.page.$('input[name="email"]');
    await email_handle.type(username);

    const password_handle = await this.page.$('input[name="password"]');
    await password_handle.type(password);
  }

  async login() {
    const button = await this.page.$('button');
    await Promise.all([
      this.page.waitForNavigation({waitUntil: ['networkidle0']}),
      await button.click(),
    ]);

    // await button.click();
    // await checkError(this.page);
    // await this.page.waitForNavigation({waitUntil: ['networkidle0']});

  }

}

module.exports = LoginPage;
