import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class BorcAlacakUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.borcAlacak.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  tutarInput: ElementFinder = element(by.css('input#borc-alacak-tutar'));
  notlarInput: ElementFinder = element(by.css('input#borc-alacak-notlar'));
  odemeAraciSelect: ElementFinder = element(by.css('select#borc-alacak-odemeAraci'));
  hareketTipiSelect: ElementFinder = element(by.css('select#borc-alacak-hareketTipi'));
  tarihInput: ElementFinder = element(by.css('input#borc-alacak-tarih'));
  userSelect: ElementFinder = element(by.css('select#borc-alacak-user'));
  urunSelect: ElementFinder = element(by.css('select#borc-alacak-urun'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTutarInput(tutar) {
    await this.tutarInput.sendKeys(tutar);
  }

  async getTutarInput() {
    return this.tutarInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setOdemeAraciSelect(odemeAraci) {
    await this.odemeAraciSelect.sendKeys(odemeAraci);
  }

  async getOdemeAraciSelect() {
    return this.odemeAraciSelect.element(by.css('option:checked')).getText();
  }

  async odemeAraciSelectLastOption() {
    await this.odemeAraciSelect.all(by.tagName('option')).last().click();
  }
  async setHareketTipiSelect(hareketTipi) {
    await this.hareketTipiSelect.sendKeys(hareketTipi);
  }

  async getHareketTipiSelect() {
    return this.hareketTipiSelect.element(by.css('option:checked')).getText();
  }

  async hareketTipiSelectLastOption() {
    await this.hareketTipiSelect.all(by.tagName('option')).last().click();
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
    await this.setTutarInput('5');
    expect(await this.getTutarInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setNotlarInput('notlar');
    expect(await this.getNotlarInput()).to.match(/notlar/);
    await waitUntilDisplayed(this.saveButton);
    await this.odemeAraciSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.hareketTipiSelectLastOption();
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
