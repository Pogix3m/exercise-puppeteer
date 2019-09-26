const puppeteer = require('puppeteer');
const LoginPage = require('./src/login');
const DashboardPage = require('./src/dashboard');
const GrowthPluginsPage = require('./src/growth-plugins');
const PluginsNewStrategyPage = require('./src/plugins-new-strategy');
const NewTemplatePage = require('./src/new-template');

const goto = async(page, url, options) => {
    options = options || {waitUntil: ['networkidle0']};
    await page.goto(url, options);
};

const ss = async(page, path, isFullPage=false) => {
    await page.screenshot({path: `screenshots/${path}`, fullPage: isFullPage});
};
let username, password;
process.argv.forEach(function (val, index,) {
  if(val === '--username' && index+1 < process.argv.length)
    username = process.argv[index+1];
  else if(val === '--password' && index+1 < process.argv.length)
    password = process.argv[index+1];
});

(async () => {
    let browser;
    try {
        const useDevUrl = false;
        browser = await puppeteer.launch({headless: false, defaultViewport: null});
        // const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultTimeout(120000);
        await goto(page, 'https://dev2.shopmessage.me/shopmessage/login');

        const login = new LoginPage(page);
        await ss(page, '1-login.png');
        await login.setCredential(username, password);
        await ss(page, '2-login-with-credentials.png');
        await login.login();
        await ss(page, '3-wizard-connect.png');

        const url = await page.url();
        let dev;
        if(useDevUrl) dev = url.replace('/app', '/dev2').replace('/wizard/connect', '/dashboard') // dev2 sub domain is not working
        else dev = url.replace('/wizard/connect', '/dashboard');
        // const dev = url.replace('/wizard/connect', '/dashboard');
        await goto(page, dev);

        const dashboard = new DashboardPage(page);
        await ss(page, '4-dashboard.png', true);
        await dashboard.selectGrowthPluginsMenu();
        await ss(page, '5-growth-plugins.png', true);

        const plugins = new GrowthPluginsPage(page);
        await plugins.create();
        await ss(page, '6-create-growth-plugins.png', true);

        const newStrategy = new PluginsNewStrategyPage(page);
        // await ss(page, '7-new-strategy.png', true);
        await newStrategy.createModal();
        await ss(page, '8-new-template-modal.png', true);

        const newTemplate = new NewTemplatePage(page);
        await newTemplate.createDraft();
        await ss(page, '9-create-draft.png', true);
        await newTemplate.changeCTAButtonColor();
        await ss(page, '10-cta-button-blue.png', true);
        await newTemplate.selectBehaviorTab();
        await ss(page, '11-behavior-tab.png', true);
        await newTemplate.changeAutomaticallyOpen();
        await ss(page, '12-do-not-automatically-open.png', true);
        await newTemplate.save();
        await ss(page, '13-save.png', true);
        await newTemplate.continue();
        await ss(page, '14-publish.png', true);
        await newTemplate.publish();
        await ss(page, '15-published.png', true);

        await plugins.toggle(newTemplate.id);
        await ss(page, '16-toggle.png', true);
    }
    catch (e) {
        // console.log('Error: ', e.message);
        console.log('Error: ', e.stack);
    }
    finally {
        // if(browser) setTimeout(() => {browser.close();}, 5000);
        if(browser) await browser.close();
    }
})();
