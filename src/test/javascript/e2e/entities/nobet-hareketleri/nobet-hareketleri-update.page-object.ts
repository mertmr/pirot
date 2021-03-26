import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class NobetHareketleriUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.nobetHareketleri.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  kasaInput: ElementFinder = element(by.css('input#nobet-hareketleri-kasa'));
  pirotInput: ElementFinder = element(by.css('input#nobet-hareketleri-pirot'));
  farkInput: ElementFinder = element(by.css('input#nobet-hareketleri-fark'));
  farkDengeInput: ElementFinder = element(by.css('input#nobet-hareketleri-farkDenge'));
  nobetSuresiInput: ElementFinder = element(by.css('input#nobet-hareketleri-nobetSuresi'));
  notlarInput: ElementFinder = element(by.css('input#nobet-hareketleri-notlar'));
  acilisKapanisSelect: ElementFinder = element(by.css('select#nobet-hareketleri-acilisKapanis'));
  tarihInput: ElementFinder = element(by.css('input#nobet-hareketleri-tarih'));
  userSelect: ElementFinder = element(by.css('select#nobet-hareketleri-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setKasaInput(kasa) {
    await this.kasaInput.sendKeys(kasa);
  }

  async getKasaInput() {
    return this.kasaInput.getAttribute('value');
  }

  async setPirotInput(pirot) {
    await this.pirotInput.sendKeys(pirot);
  }

  async getPirotInput() {
    return this.pirotInput.getAttribute('value');
  }

  async setFarkInput(fark) {
    await this.farkInput.sendKeys(fark);
  }

  async getFarkInput() {
    return this.farkInput.getAttribute('value');
  }

  async setFarkDengeInput(farkDenge) {
    await this.farkDengeInput.sendKeys(farkDenge);
  }

  async getFarkDengeInput() {
    return this.farkDengeInput.getAttribute('value');
  }

  async setNobetSuresiInput(nobetSuresi) {
    await this.nobetSuresiInput.sendKeys(nobetSuresi);
  }

  async getNobetSuresiInput() {
    return this.nobetSuresiInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setAcilisKapanisSelect(acilisKapanis) {
    await this.acilisKapanisSelect.sendKeys(acilisKapanis);
  }

  async getAcilisKapanisSelect() {
    return this.acilisKapanisSelect.element(by.css('option:checked')).getText();
  }

  async acilisKapanisSelectLastOption() {
    await this.acilisKapanisSelect.all(by.tagName('option')).last().click();
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
    await this.setKasaInput('5');
    expect(await this.getKasaInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setPirotInput('5');
    expect(await this.getPirotInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setFarkInput('5');
    expect(await this.getFarkInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setFarkDengeInput('5');
    expect(await this.getFarkDengeInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setNobetSuresiInput('5');
    expect(await this.getNobetSuresiInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setNotlarInput('notlar');
    expect(await this.getNotlarInput()).to.match(/notlar/);
    await waitUntilDisplayed(this.saveButton);
    await this.acilisKapanisSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getTarihInput()).to.contain('2001-01-01T02:30');
    await this.userSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
