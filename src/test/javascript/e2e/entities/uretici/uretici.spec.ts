import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import UreticiComponentsPage, { UreticiDeleteDialog } from './uretici.page-object';
import UreticiUpdatePage from './uretici-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Uretici e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ureticiComponentsPage: UreticiComponentsPage;
  let ureticiUpdatePage: UreticiUpdatePage;
  let ureticiDeleteDialog: UreticiDeleteDialog;
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

  it('should load Ureticis', async () => {
    await navBarPage.getEntityPage('uretici');
    ureticiComponentsPage = new UreticiComponentsPage();
    expect(await ureticiComponentsPage.title.getText()).to.match(/Ureticis/);

    expect(await ureticiComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([ureticiComponentsPage.noRecords, ureticiComponentsPage.table]);

    beforeRecordsCount = (await isVisible(ureticiComponentsPage.noRecords)) ? 0 : await getRecordsCount(ureticiComponentsPage.table);
  });

  it('should load create Uretici page', async () => {
    await ureticiComponentsPage.createButton.click();
    ureticiUpdatePage = new UreticiUpdatePage();
    expect(await ureticiUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.uretici.home.createOrEditLabel/);
    await ureticiUpdatePage.cancel();
  });

  it('should create and save Ureticis', async () => {
    await ureticiComponentsPage.createButton.click();
    await ureticiUpdatePage.setAdiInput('adi');
    expect(await ureticiUpdatePage.getAdiInput()).to.match(/adi/);
    await ureticiUpdatePage.setAdresInput('adres');
    expect(await ureticiUpdatePage.getAdresInput()).to.match(/adres/);
    await ureticiUpdatePage.setBankaBilgileriInput('bankaBilgileri');
    expect(await ureticiUpdatePage.getBankaBilgileriInput()).to.match(/bankaBilgileri/);
    await ureticiUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await ureticiUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await ureticiUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(ureticiUpdatePage.saveButton);
    await ureticiUpdatePage.save();
    await waitUntilHidden(ureticiUpdatePage.saveButton);
    expect(await isVisible(ureticiUpdatePage.saveButton)).to.be.false;

    expect(await ureticiComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(ureticiComponentsPage.table);

    await waitUntilCount(ureticiComponentsPage.records, beforeRecordsCount + 1);
    expect(await ureticiComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Uretici', async () => {
    const deleteButton = ureticiComponentsPage.getDeleteButton(ureticiComponentsPage.records.last());
    await click(deleteButton);

    ureticiDeleteDialog = new UreticiDeleteDialog();
    await waitUntilDisplayed(ureticiDeleteDialog.deleteModal);
    expect(await ureticiDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.uretici.delete.question/);
    await ureticiDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(ureticiDeleteDialog.deleteModal);

    expect(await isVisible(ureticiDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([ureticiComponentsPage.noRecords, ureticiComponentsPage.table]);

    const afterCount = (await isVisible(ureticiComponentsPage.noRecords)) ? 0 : await getRecordsCount(ureticiComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
