import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import SatisComponentsPage, { SatisDeleteDialog } from './satis.page-object';
import SatisUpdatePage from './satis-update.page-object';
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

describe('Satis e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let satisComponentsPage: SatisComponentsPage;
  let satisUpdatePage: SatisUpdatePage;
  let satisDeleteDialog: SatisDeleteDialog;
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

  it('should load Satis', async () => {
    await navBarPage.getEntityPage('satis');
    satisComponentsPage = new SatisComponentsPage();
    expect(await satisComponentsPage.title.getText()).to.match(/Satis/);

    expect(await satisComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([satisComponentsPage.noRecords, satisComponentsPage.table]);

    beforeRecordsCount = (await isVisible(satisComponentsPage.noRecords)) ? 0 : await getRecordsCount(satisComponentsPage.table);
  });

  it('should load create Satis page', async () => {
    await satisComponentsPage.createButton.click();
    satisUpdatePage = new SatisUpdatePage();
    expect(await satisUpdatePage.getPageTitle().getAttribute('id')).to.match(/koopApp.satis.home.createOrEditLabel/);
    await satisUpdatePage.cancel();
  });

  it('should create and save Satis', async () => {
    await satisComponentsPage.createButton.click();
    await satisUpdatePage.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await satisUpdatePage.getTarihInput()).to.contain('2001-01-01T02:30');
    await satisUpdatePage.setToplamTutarInput('5');
    expect(await satisUpdatePage.getToplamTutarInput()).to.eq('5');
    const selectedOrtagaSatis = await satisUpdatePage.getOrtagaSatisInput().isSelected();
    if (selectedOrtagaSatis) {
      await satisUpdatePage.getOrtagaSatisInput().click();
      expect(await satisUpdatePage.getOrtagaSatisInput().isSelected()).to.be.false;
    } else {
      await satisUpdatePage.getOrtagaSatisInput().click();
      expect(await satisUpdatePage.getOrtagaSatisInput().isSelected()).to.be.true;
    }
    const selectedKartliSatis = await satisUpdatePage.getKartliSatisInput().isSelected();
    if (selectedKartliSatis) {
      await satisUpdatePage.getKartliSatisInput().click();
      expect(await satisUpdatePage.getKartliSatisInput().isSelected()).to.be.false;
    } else {
      await satisUpdatePage.getKartliSatisInput().click();
      expect(await satisUpdatePage.getKartliSatisInput().isSelected()).to.be.true;
    }
    await satisUpdatePage.userSelectLastOption();
    await satisUpdatePage.kisiSelectLastOption();
    await waitUntilDisplayed(satisUpdatePage.saveButton);
    await satisUpdatePage.save();
    await waitUntilHidden(satisUpdatePage.saveButton);
    expect(await isVisible(satisUpdatePage.saveButton)).to.be.false;

    expect(await satisComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(satisComponentsPage.table);

    await waitUntilCount(satisComponentsPage.records, beforeRecordsCount + 1);
    expect(await satisComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Satis', async () => {
    const deleteButton = satisComponentsPage.getDeleteButton(satisComponentsPage.records.last());
    await click(deleteButton);

    satisDeleteDialog = new SatisDeleteDialog();
    await waitUntilDisplayed(satisDeleteDialog.deleteModal);
    expect(await satisDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.satis.delete.question/);
    await satisDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(satisDeleteDialog.deleteModal);

    expect(await isVisible(satisDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([satisComponentsPage.noRecords, satisComponentsPage.table]);

    const afterCount = (await isVisible(satisComponentsPage.noRecords)) ? 0 : await getRecordsCount(satisComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
