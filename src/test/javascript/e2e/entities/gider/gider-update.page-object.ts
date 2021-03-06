import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class GiderUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.gider.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  tarihInput: ElementFinder = element(by.css('input#gider-tarih'));
  tutarInput: ElementFinder = element(by.css('input#gider-tutar'));
  notlarInput: ElementFinder = element(by.css('input#gider-notlar'));
  giderTipiSelect: ElementFinder = element(by.css('select#gider-giderTipi'));
  odemeAraciSelect: ElementFinder = element(by.css('select#gider-odemeAraci'));
  userSelect: ElementFinder = element(by.css('select#gider-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
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

  async setGiderTipiSelect(giderTipi) {
    await this.giderTipiSelect.sendKeys(giderTipi);
  }

  async getGiderTipiSelect() {
    return this.giderTipiSelect.element(by.css('option:checked')).getText();
  }

  async giderTipiSelectLastOption() {
    await this.giderTipiSelect.all(by.tagName('option')).last().click();
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
    await this.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getTarihInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    await this.setTutarInput('5');
    expect(await this.getTutarInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setNotlarInput('notlar');
    expect(await this.getNotlarInput()).to.match(/notlar/);
    await waitUntilDisplayed(this.saveButton);
    await this.giderTipiSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    await this.odemeAraciSelectLastOption();
    await this.userSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
