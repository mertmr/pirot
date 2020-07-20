import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { waitUntilAnyDisplayed, waitUntilDisplayed, click, waitUntilHidden, isVisible } from '../../util/utils';

import NavBarPage from './../../page-objects/navbar-page';

import VirmanUpdatePage from './virman-update.page-object';

const expect = chai.expect;
export class VirmanDeleteDialog {
  deleteModal = element(by.className('modal'));
  private dialogTitle: ElementFinder = element(by.id('koopApp.virman.delete.question'));
  private confirmButton = element(by.id('koop-confirm-delete-virman'));

  getDialogTitle() {
    return this.dialogTitle;
  }

  async clickOnConfirmButton() {
    await this.confirmButton.click();
  }
}

export default class VirmanComponentsPage {
  createButton: ElementFinder = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('div table .btn-danger'));
  title: ElementFinder = element(by.id('virman-heading'));
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
    await navBarPage.getEntityPage('virman');
    await waitUntilAnyDisplayed([this.noRecords, this.table]);
    return this;
  }

  async goToCreateVirman() {
    await this.createButton.click();
    return new VirmanUpdatePage();
  }

  async deleteVirman() {
    const deleteButton = this.getDeleteButton(this.records.last());
    await click(deleteButton);

    const virmanDeleteDialog = new VirmanDeleteDialog();
    await waitUntilDisplayed(virmanDeleteDialog.deleteModal);
    expect(await virmanDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/koopApp.virman.delete.question/);
    await virmanDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(virmanDeleteDialog.deleteModal);

    expect(await isVisible(virmanDeleteDialog.deleteModal)).to.be.false;
  }
}
