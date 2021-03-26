import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import UreticiUpdatePage from './uretici-update.page-object';

const expect = chai.expect;
export class UreticiDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.uretici.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-uretici'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class UreticiComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('uretici-heading'));
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
    await navBarPage.getEntityPage('uretici');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateUretici() {
    await this.createButton.click();
    return new UreticiUpdatePage();
  }

  async deleteUretici() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const ureticiDeleteDialog = new UreticiDeleteDialog();
    await waitUntilDisplayed(ureticiDeleteDialog.deleteModal);
    expect(await ureticiDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.uretici.delete.question/);
    await ureticiDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(ureticiDeleteDialog.deleteModal);

    expect(await isVisible(ureticiDeleteDialog.deleteModal)).to.be.false;
  }
}
