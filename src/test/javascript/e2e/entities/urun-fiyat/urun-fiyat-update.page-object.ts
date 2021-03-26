import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class UrunFiyatUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.urunFiyat.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  fiyatInput: ElementFinder = element(by.css('input#urun-fiyat-fiyat'));
  tarihInput: ElementFinder = element(by.css('input#urun-fiyat-tarih'));
  userSelect: ElementFinder = element(by.css('select#urun-fiyat-user'));
  urunSelect: ElementFinder = element(by.css('select#urun-fiyat-urun'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setFiyatInput(fiyat) {
    await this.fiyatInput.sendKeys(fiyat);
  }

  async getFiyatInput() {
    return this.fiyatInput.getAttribute('value');
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
    await this.setFiyatInput('5');
    expect(await this.getFiyatInput()).to.eq('5');
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
