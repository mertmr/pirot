import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import GiderUpdatePage from './gider-update.page-object';

const expect = chai.expect;
export class GiderDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.gider.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-gider'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class GiderComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('gider-heading'));
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
    await navBarPage.getEntityPage('gider');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateGider() {
    await this.createButton.click();
    return new GiderUpdatePage();
  }

  async deleteGider() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const giderDeleteDialog = new GiderDeleteDialog();
    await waitUntilDisplayed(giderDeleteDialog.deleteModal);
    expect(await giderDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.gider.delete.question/);
    await giderDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(giderDeleteDialog.deleteModal);

    expect(await isVisible(giderDeleteDialog.deleteModal)).to.be.false;
  }
}
