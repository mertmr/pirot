import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import SatisUpdatePage from './satis-update.page-object';

const expect = chai.expect;
export class SatisDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.satis.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-satis'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class SatisComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('satis-heading'));
  noRecords: ElementFinder = element(by.css('#app-view-container .table-responsive div.alert.alert-warning'));
  table: ElementFinder = element(by.css('#app-view-container div.table-responsive > table'));

  records: ElementArrayFinder = this.table.all(by.css('tbody tr'));

  getDetailsButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-info.btn-sm'));
  }

  getEditButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-primary.btn-sm'));
  }

  getDeleteButton(record: ElementFinder) {
    return record.element(by.css('a.btn.btn-danger.btn-sm'));
  }

  async goToPage(navBarPage: NavBarPage) {
    await navBarPage.getEntityPage('satis');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateSatis() {
    await this.createButton.click();
    return new SatisUpdatePage();
  }

  async deleteSatis() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const satisDeleteDialog = new SatisDeleteDialog();
    await waitUntilDisplayed(satisDeleteDialog.deleteModal);
    expect(await satisDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.satis.delete.question/);
    await satisDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(satisDeleteDialog.deleteModal);

    expect(await isVisible(satisDeleteDialog.deleteModal)).to.be.false;
  }
}
