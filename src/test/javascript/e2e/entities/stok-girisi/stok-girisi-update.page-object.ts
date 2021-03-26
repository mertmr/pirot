import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class StokGirisiUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.stokGirisi.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  miktarInput: ElementFinder = element(by.css('input#stok-girisi-miktar'));
  agirlikInput: ElementFinder = element(by.css('input#stok-girisi-agirlik'));
  notlarInput: ElementFinder = element(by.css('input#stok-girisi-notlar'));
  stokHareketiTipiSelect: ElementFinder = element(by.css('select#stok-girisi-stokHareketiTipi'));
  tarihInput: ElementFinder = element(by.css('input#stok-girisi-tarih'));
  userSelect: ElementFinder = element(by.css('select#stok-girisi-user'));
  urunSelect: ElementFinder = element(by.css('select#stok-girisi-urun'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setMiktarInput(miktar) {
    await this.miktarInput.sendKeys(miktar);
  }

  async getMiktarInput() {
    return this.miktarInput.getAttribute('value');
  }

  async setAgirlikInput(agirlik) {
    await this.agirlikInput.sendKeys(agirlik);
  }

  async getAgirlikInput() {
    return this.agirlikInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setStokHareketiTipiSelect(stokHareketiTipi) {
    await this.stokHareketiTipiSelect.sendKeys(stokHareketiTipi);
  }

  async getStokHareketiTipiSelect() {
    return this.stokHareketiTipiSelect.element(by.css('option:checked')).getText();
  }

  async stokHareketiTipiSelectLastOption() {
    await this.stokHareketiTipiSelect.all(by.tagName('option')).last().click();
  }
  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
  }

  async userSelectLastOption() {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
  }

  async urunSelectLastOption() {
    await this.urunSelect.all(by.tagName('option')).last().click();
  }

  async urunSelectOption(option) {
    await this.urunSelect.sendKeys(option);
  }

  getUrunSelect() {
    return this.urunSelect;
  }

  async getUrunSelectedOption() {
    return this.urunSelect.element(by.css('option:checked')).getText();
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
    await this.setMiktarInput('5');
    expect(await this.getMiktarInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setAgirlikInput('5');
    expect(await this.getAgirlikInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setNotlarInput('notlar');
    expect(await this.getNotlarInput()).to.match(/notlar/);
    await waitUntilDisplayed(this.saveButton);
    await this.stokHareketiTipiSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getTarihInput()).to.contain('2001-01-01T02:30');
    await this.userSelectLastOption();
    await this.urunSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
