import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import UrunFiyatHesapUpdatePage from './urun-fiyat-hesap-update.page-object';

const expect = chai.expect;
export class UrunFiyatHesapDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.urunFiyatHesap.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-urunFiyatHesap'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class UrunFiyatHesapComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('urun-fiyat-hesap-heading'));
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
    await navBarPage.getEntityPage('urun-fiyat-hesap');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateUrunFiyatHesap() {
    await this.createButton.click();
    return new UrunFiyatHesapUpdatePage();
  }

  async deleteUrunFiyatHesap() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const urunFiyatHesapDeleteDialog = new UrunFiyatHesapDeleteDialog();
    await waitUntilDisplayed(urunFiyatHesapDeleteDialog.deleteModal);
    expect(await urunFiyatHesapDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.urunFiyatHesap.delete.question/);
    await urunFiyatHesapDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(urunFiyatHesapDeleteDialog.deleteModal);

    expect(await isVisible(urunFiyatHesapDeleteDialog.deleteModal)).to.be.false;
  }
}
