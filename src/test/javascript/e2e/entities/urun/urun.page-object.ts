import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import UrunUpdatePage from './urun-update.page-object';

const expect = chai.expect;
export class UrunDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.urun.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-urun'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class UrunComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('urun-heading'));
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
    await navBarPage.getEntityPage('urun');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateUrun() {
    await this.createButton.click();
    return new UrunUpdatePage();
  }

  async deleteUrun() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const urunDeleteDialog = new UrunDeleteDialog();
    await waitUntilDisplayed(urunDeleteDialog.deleteModal);
    expect(await urunDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.urun.delete.question/);
    await urunDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(urunDeleteDialog.deleteModal);

    expect(await isVisible(urunDeleteDialog.deleteModal)).to.be.false;
  }
}
