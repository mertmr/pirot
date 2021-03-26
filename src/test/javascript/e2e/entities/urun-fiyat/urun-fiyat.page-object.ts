import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import UrunFiyatUpdatePage from './urun-fiyat-update.page-object';

const expect = chai.expect;
export class UrunFiyatDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.urunFiyat.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-urunFiyat'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class UrunFiyatComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('urun-fiyat-heading'));
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
    await navBarPage.getEntityPage('urun-fiyat');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateUrunFiyat() {
    await this.createButton.click();
    return new UrunFiyatUpdatePage();
  }

  async deleteUrunFiyat() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const urunFiyatDeleteDialog = new UrunFiyatDeleteDialog();
    await waitUntilDisplayed(urunFiyatDeleteDialog.deleteModal);
    expect(await urunFiyatDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.urunFiyat.delete.question/);
    await urunFiyatDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(urunFiyatDeleteDialog.deleteModal);

    expect(await isVisible(urunFiyatDeleteDialog.deleteModal)).to.be.false;
  }
}
