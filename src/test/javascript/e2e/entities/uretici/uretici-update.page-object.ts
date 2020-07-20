import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class UreticiUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.uretici.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  adiInput: ElementFinder = element(by.css('input#uretici-adi'));
  adresInput: ElementFinder = element(by.css('input#uretici-adres'));
  bankaBilgileriInput: ElementFinder = element(by.css('input#uretici-bankaBilgileri'));
  tarihInput: ElementFinder = element(by.css('input#uretici-tarih'));
  userSelect: ElementFinder = element(by.css('select#uretici-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setAdiInput(adi) {
    await this.adiInput.sendKeys(adi);
  }

  async getAdiInput() {
    return this.adiInput.getAttribute('value');
  }

  async setAdresInput(adres) {
    await this.adresInput.sendKeys(adres);
  }

  async getAdresInput() {
    return this.adresInput.getAttribute('value');
  }

  async setBankaBilgileriInput(bankaBilgileri) {
    await this.bankaBilgileriInput.sendKeys(bankaBilgileri);
  }

  async getBankaBilgileriInput() {
    return this.bankaBilgileriInput.getAttribute('value');
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
    await this.setAdiInput('adi');
    expect(await this.getAdiInput()).to.match(/adi/);
    await waitUntilDisplayed(this.saveButton);
    await this.setAdresInput('adres');
    expect(await this.getAdresInput()).to.match(/adres/);
    await waitUntilDisplayed(this.saveButton);
    await this.setBankaBilgileriInput('bankaBilgileri');
    expect(await this.getBankaBilgileriInput()).to.match(/bankaBilgileri/);
    await waitUntilDisplayed(this.saveButton);
    await this.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getTarihInput()).to.contain('2001-01-01T02:30');
    await this.userSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
