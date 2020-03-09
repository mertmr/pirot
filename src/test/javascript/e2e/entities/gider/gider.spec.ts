import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import GiderComponentsPage, { GiderDeleteDialog } from './gider.page-object';
import GiderUpdatePage from './gider-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible
} from '../../util/utils';

const expect = chai.expect;

describe('Gider e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let giderComponentsPage: GiderComponentsPage;
  let giderUpdatePage: GiderUpdatePage;
  let giderDeleteDialog: GiderDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Giders', async () => {
    await navBarPage.getEntityPage('gider');
    giderComponentsPage = new GiderComponentsPage();
    expect(await giderComponentsPage.title.getText()).to.match(/Giders/);

    expect(await giderComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([giderComponentsPage.noRecords, giderComponentsPage.table]);

    beforeRecordsCount = (await isVisible(giderComponentsPage.noRecords)) ? 0 : await getRecordsCount(giderComponentsPage.table);
  });

  it('should load create Gider page', async () => {
    await giderComponentsPage.createButton.click();
    giderUpdatePage = new GiderUpdatePage();
    expect(await giderUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.gider.home.createOrEditLabel/);
    await giderUpdatePage.cancel();
  });

  it('should create and save Giders', async () => {
    await giderComponentsPage.createButton.click();
    await giderUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await giderUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await giderUpdatePage.setTutarInput('5');
    expect(await giderUpdatePage.getTutarInput()).to.eq('5');
    await giderUpdatePage.setNotlarInput('notlar');
    expect(await giderUpdatePage.getNotlarInput()).to.match(/notlar/);
    await giderUpdatePage.giderTipiSelectLastOption();
    await giderUpdatePage.odemeAraciSelectLastOption();
    await giderUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(giderUpdatePage.saveButton);
    await giderUpdatePage.save();
    await waitUntilHidden(giderUpdatePage.saveButton);
    expect(await isVisible(giderUpdatePage.saveButton)).to.be.false;

    expect(await giderComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(giderComponentsPage.table);

    await waitUntilCount(giderComponentsPage.records, beforeRecordsCount + 1);
    expect(await giderComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Gider', async () => {
    const deleteButton = giderComponentsPage.getDeleteButton(giderComponentsPage.records.last());
    await click(deleteButton);

    giderDeleteDialog = new GiderDeleteDialog();
    await waitUntilDisplayed(giderDeleteDialog.deleteModal);
    expect(await giderDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.gider.delete.question/);
    await giderDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(giderDeleteDialog.deleteModal);

    expect(await isVisible(giderDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([giderComponentsPage.noRecords, giderComponentsPage.table]);

    const afterCount = (await isVisible(giderComponentsPage.noRecords)) ? 0 : await getRecordsCount(giderComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
