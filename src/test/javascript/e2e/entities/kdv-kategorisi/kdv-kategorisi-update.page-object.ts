import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class KdvKategorisiUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.kdvKategorisi.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  kategoriAdiInput: ElementFinder = element(by.css('input#kdv-kategorisi-kategoriAdi'));
  kdvOraniInput: ElementFinder = element(by.css('input#kdv-kategorisi-kdvOrani'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setKategoriAdiInput(kategoriAdi) {
    await this.kategoriAdiInput.sendKeys(kategoriAdi);
  }

  async getKategoriAdiInput() {
    return this.kategoriAdiInput.getAttribute('value');
  }

  async setKdvOraniInput(kdvOrani) {
    await this.kdvOraniInput.sendKeys(kdvOrani);
  }

  async getKdvOraniInput() {
    return this.kdvOraniInput.getAttribute('value');
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setKategoriAdiInput('kategoriAdi');
    expect(await this.getKategoriAdiInput()).to.match(/kategoriAdi/);
    await waitUntilDisplayed(this.saveButton);
    await this.setKdvOraniInput('5');
    expect(await this.getKdvOraniInput()).to.eq('5');
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
